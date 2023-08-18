import * as React from 'react'
import {
  ConferenceStatusEvent,
  ConnectionRequest,
  ConnectionResult,
  SharescreenRequest,
} from '../../models/ConferenceStatusEvent'
import { Participant } from '../../models/Participant'
import { MessageTypes, UserRoles } from '../../utils/commonUtils'

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
