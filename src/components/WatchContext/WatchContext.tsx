/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import * as React from 'react'
import {
  ConferenceStatusEvent,
  ConnectionRequest,
  ConnectionResult,
  SharescreenRequest,
} from '../../models/ConferenceStatusEvent'
import { Participant } from '../../models/Participant'
import { MessageTypes, UserRoles } from '../../utils/commonUtils'

const getMockParticipantList = (conferenceId: number, amount: number) => {
  const list: Participant[] = []
  for (let i = 0; i < amount; i++) {
    list.push({
      participantId: 1000 + i,
      conferenceId: 2,
      streamGuid: 'live/test',
      displayName: `Larry${i}`,
      role: 'PARTICIPANT',
      muteState: {
        audioMuted: true,
        videoMuted: false,
        chatMuted: false,
        screenMuted: false,
      },
    })
  }
  return list
}

interface IWatchProviderProps {
  children: any
}

const isNotRoles = (p: Participant, roles: string[]) => {
  const { role } = p
  const based = roles.map((r) => r.toLowerCase())
  return based.indexOf(role.toLowerCase()) === -1
}

const getScreenshareParticipants = (state: any, action: any, pid: number) => {
  const screenshareParticipants =
    action.payload.filter((p: Participant) => p.screenshareGuid && p.participantId !== pid) || []

  const ownScreenshare = action.payload.find((p: Participant) => p.participantId === pid && p.screenshareGuid)

  let closeCurrentScreenShare = false

  // when a participant "takes over" the screen then I need to close the current screenshare
  if (ownScreenshare && screenshareParticipants.length && !state.screenshareParticipants.length) {
    closeCurrentScreenShare = true
  }

  return { screenshareParticipants, closeCurrentScreenShare }
}

const listReducer = (state: any, action: any) => {
  let currentParticipant: Participant | undefined
  const pid = state.connection ? state.connection.participantId : undefined

  switch (action.type) {
    case 'UPDATE_LIST':
      // NOTE: VIP is not included in the list of participants.
      // NOTE: Current user if not included in the list of participants.
      currentParticipant = action.payload.find((p: Participant) => p.participantId === pid)
      return {
        ...state,
        list: action.payload.filter((p: Participant) => p.participantId !== pid),
        vip: action.vip,
        anonymousViewerAmount: action.anonymousViewerAmount,
        currentParticipantState: currentParticipant?.muteState ?? {},
      }
    case 'UPDATE_SCREENSHARES':
      return {
        ...state,
        ...getScreenshareParticipants(state, action, pid),
      }
    case 'SET_CONNECTION_DATA':
      return { ...state, connection: action.payload }
    case 'SET_CONFERENCE_DATA':
      return { ...state, conference: action.payload }
    case 'SET_CONFERENCE_ERROR':
      return { ...state, error: action.payload }
    case 'CONFERENCE_CLOSE':
      return { ...state, closed: true, list: [], vip: undefined }
    default:
      return state
  }
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const socketRef = React.useRef<any>()

  const [error, setError] = React.useState<any>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [hostSocket, setHostSocket] = React.useState<WebSocket | undefined>()

  const [data, dispatch] = React.useReducer(listReducer, {
    error: undefined,
    closed: false,
    connection: undefined,
    conference: undefined,
    currentParticipantState: undefined,
    status: undefined,
    vip: undefined,
    anonymousViewerAmount: 0,
    list: [], //Participant[]
    screenshareParticipants: [], //Participant[], the screen will show only the first one
    closeCurrentScreenShare: false,
  })

  React.useEffect(() => {
    socketRef.current = hostSocket
    return () => {
      leave()
    }
  }, [hostSocket])

  const updateStreamsList = (participants: Participant[]) => {
    const vip = participants.find((s: Participant) => (s.role as string).toLowerCase() === UserRoles.VIP.toLowerCase())
    const anonymousViewers = participants.filter((p: Participant) => {
      return (p.role as string).toLowerCase() === UserRoles.ANONYMOUS.toLowerCase()
    })
    const list = participants
      .filter((p: Participant) => isNotRoles(p, [UserRoles.VIP, UserRoles.ANONYMOUS]))
      .sort((a: Participant) => (a.role.toLocaleLowerCase() === UserRoles.ORGANIZER.toLocaleLowerCase() ? -1 : 1))

    dispatch({ type: 'UPDATE_LIST', payload: list, vip, anonymousViewerAmount: anonymousViewers.length })
  }

  const updateScreenshareList = (participants: Participant[]) => {
    dispatch({ type: 'UPDATE_SCREENSHARES', payload: participants })
  }

  const join = (url: string, joinRequest: ConnectionRequest) => {
    console.log('JOIN', url, joinRequest)
    if (socketRef && socketRef.current) {
      const ws = socketRef.current as WebSocket
      if (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING) {
        console.log('JOIN - SOCKET ALREADY OPEN')
        return
      }
    }

    if (!hostSocket || (hostSocket && hostSocket.url !== url)) {
      leave()
      setLoading(true)
      const socket = new WebSocket(url)
      socket.onopen = () => {
        setLoading(false)
        socket.send(JSON.stringify(joinRequest))
      }
      socket.onmessage = (event) => {
        console.log('SOCKET MESSAGE', event)
        const payload = JSON.parse(event.data)
        const { messageType } = payload
        if (messageType === MessageTypes.ERROR) {
          const error = payload as ConnectionResult
          setError({ data: null, status: error.messageType, statusText: error.error })
          dispatch({ type: 'SET_CONFERENCE_ERROR', payload: error })
        } else if (messageType === MessageTypes.JOIN_RESPONSE) {
          const response = payload as ConnectionResult
          dispatch({ type: 'SET_CONNECTION_DATA', payload: response })
        } else if (messageType === MessageTypes.STATE_EVENT) {
          const details = payload as ConferenceStatusEvent
          dispatch({ type: 'SET_CONFERENCE_DATA', payload: details.state })
          // updateStreamsList(getMockParticipantList(details.state.conferenceId, 0))
          updateStreamsList(details.state.participants)
          updateScreenshareList(details.state.participants)
        }
      }
      socket.onerror = (event) => {
        const { type } = event
        if (type === 'error') {
          console.error('SOCKET ERROR', error)
          setError({ data: null, status: 404, statusText: `Connection could not be opened properly.` })
          setLoading(false)
        }
      }
      socket.onclose = (event) => {
        const { wasClean, code } = event
        if (!wasClean || code !== 1000) {
          // Not Expected.
          setError({ data: null, status: code, statusText: 'Connection closed unexpectedly.' })
        }
        console.log('SOCKET CLOSE', event)
        dispatch({ type: 'CONFERENCE_CLOSE', payload: true })
      }
      setHostSocket(socket)
    }
  }

  const leave = () => {
    if (socketRef.current) {
      try {
        ;(socketRef.current as WebSocket).close(1000)
      } catch (e) {
        console.error(e)
      }
      socketRef.current = undefined
      setHostSocket(undefined)
    }
  }

  const retry = (url: string, joinRequest: ConnectionRequest) => {
    join(url, joinRequest)
  }

  const shareScreen = (screenshareGuid: string) => {
    const request: SharescreenRequest = {
      messageType: MessageTypes.SHARESCREEN_UPDATE_EVENT,
      screenshareGuid: screenshareGuid,
    }

    try {
      hostSocket?.send(JSON.stringify(request))

      return true
    } catch (e) {
      console.error(e)

      return false
    }
  }

  const shutdownShareScreen = () => {
    const request: SharescreenRequest = {
      messageType: MessageTypes.SHARESCREEN_UPDATE_EVENT,
      screenshareGuid: null,
    }

    try {
      hostSocket?.send(JSON.stringify(request))
    } catch (e) {
      console.error(e)
    }
  }

  const exportedValues = {
    error,
    loading,
    data,
    join,
    leave,
    retry,
    shareScreen,
    shutdownShareScreen,
  }

  return <WatchContext.Provider value={exportedValues}>{children}</WatchContext.Provider>
}

export default {
  Context: WatchContext,
  Consumer: WatchContext.Consumer,
  Provider: WatchProvider,
}
