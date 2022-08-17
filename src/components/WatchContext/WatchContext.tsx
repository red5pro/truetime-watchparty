import * as React from 'react'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { ConferenceStatusEvent } from '../../models/ConferenceStatusEvent'
import { Participant } from '../../models/Participant'
import { removeFromArray, UserRoles } from '../../utils/commonUtils'

interface IWatchProviderProps {
  children: any
}

interface IConnectionResult {
  result: string
  particpantId: number
  username?: string
  error?: string
}

const listReducer = (state: any, action: any) => {
  const pid = state.connection ? state.connection.participantId : undefined
  switch (action.type) {
    case 'UPDATE_LIST':
      console.log('PAYLOAD', action.payload)
      console.log('STATE', state)
      return { ...state, list: action.payload.filter((p: Participant) => p.participantId !== pid), vip: action.vip }
    case 'SET_CONNECTION_DATA':
      return { ...state, connection: action.payload }
    case 'SET_CONFERENCE_DATA':
      return { ...state, conference: action.payload }
  }
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  console.log('WATCH PROVIDER')
  const { children } = props

  const socketRef = React.useRef()

  const [message, setMessage] = React.useState<string>('')
  const [hostSocket, setHostSocket] = React.useState<any>()
  const [streamsList, setStreamsList] = React.useState<Participant[]>([])
  const [connectionResult, setConnectionResult] = React.useState<any | undefined>()
  const [conferenceStatus, setConferenceStatus] = React.useState<ConferenceStatusEvent | undefined>()
  const [vipParticipant, setVipParticipant] = React.useState<Participant | undefined>()

  const [data, dispatch] = React.useReducer(listReducer, {
    connection: undefined,
    conference: undefined,
    status: undefined,
    vip: undefined,
    list: [],
  })

  React.useEffect(() => {
    socketRef.current = hostSocket
    return () => {
      leave()
    }
  }, [hostSocket])

  const updateStreamsList = (participants: Participant[]) => {
    // TODO: Check if VIP has entered!
    const exclude = connectionResult?.particpantId
    const tempList = [...streamsList].filter((p: Participant) => p.participantId !== exclude)
    const toAdd = participants.filter((p: Participant) => {
      const match = tempList.find((s: Participant) => p.participantId === s.participantId)
      if (!match) {
        return p
      }
      return undefined
    })
    const toRemove = tempList.filter((s: Participant) => {
      const match = participants.find((p: Participant) => s.participantId === p.participantId)
      if (!match) {
        return s
      }
      return undefined
    })
    //    console.log('ADD', toAdd)
    //    console.log('REMOVE', toRemove)
    //    setStreamsList(participants)
    const vip = participants.find((s: Participant) => (s.role as string).toLowerCase() === UserRoles.VIP.toLowerCase())
    dispatch({ type: 'UPDATE_LIST', payload: participants, vip })
  }

  const join = (url: string) => {
    leave()
    console.log('RESULT', connectionResult)
    console.log('STREAMS', streamsList)
    const socket = new WebSocket(url)
    socket.onopen = () => {
      console.log('SOCKET', 'open')
    }
    socket.onmessage = (event) => {
      console.log('SOCKET', event)
      const payload = JSON.parse(event.data)
      if (payload.result) {
        //        setConnectionResult(payload)
        dispatch({ type: 'SET_CONNECTION_DATA', payload: payload })
      } else if (payload.error) {
        //        setConnectionResult(payload)
        dispatch({ type: 'SET_CONNECTION_DATA', payload: payload })
      } else if (payload.conferenceId) {
        const details = payload as ConferenceStatusEvent
        //setConferenceStatus(details)
        dispatch({ type: 'SET_CONFERENCE_DATA', payload: details })
        updateStreamsList(details.participants)
      }
    }
    socket.onerror = (error) => {
      console.error('SOCKET', error)
    }
    setMessage('Hi!')
    setHostSocket(socket)
  }

  const leave = () => {
    // TODO: Teardown socket host
    if (socketRef.current) {
      try {
        ;(socketRef.current as WebSocket).close(1000)
      } catch (e) {
        console.error(e)
      }
      socketRef.current = undefined
      setMessage('BYE')
      setHostSocket(undefined)
    }
  }

  const exportedValues = {
    message,
    streamsList,
    conferenceStatus,
    connectionResult,
    vipParticipant,
    data,
    join,
    leave,
  }

  return <WatchContext.Provider value={exportedValues}>{children}</WatchContext.Provider>
}

export default {
  Context: WatchContext,
  Consumer: WatchContext.Consumer,
  Provider: WatchProvider,
}
