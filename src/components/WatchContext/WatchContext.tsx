import * as React from 'react'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { ConferenceStatusEvent } from '../../models/ConferenceStatusEvent'
import { Participant } from '../../models/Participant'
import { removeFromArray } from '../../utils/commonUtils'

interface IWatchProviderProps {
  children: any
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const [message, setMessage] = React.useState<string>('')
  const [hostSocket, setHostSocket] = React.useState<any>()
  const [streamsList, setStreamsList] = React.useState<Participant[]>([])
  const [connectionResult, setConnectionResult] = React.useState<any>()
  const [conferenceStatus, setConferenceStatus] = React.useState<ConferenceStatusEvent | undefined>()

  const updateStreamsList = (participants: Participant[]) => {
    const tempList = [...streamsList]
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
    console.log('ADD', toAdd)
    console.log('REMOVE', toRemove)
    setStreamsList(participants)
  }

  const join = (url: string) => {
    // TODO: Setup socket host
    leave()
    const socket = new WebSocket(url)
    socket.onopen = () => {
      console.log('SOCKET', 'open')
    }
    socket.onmessage = (message) => {
      console.log('SOCKET', message)
      const payload = JSON.parse(message.data)
      if (payload.result) {
        setConnectionResult(payload)
      } else if (payload.error) {
        setConnectionResult(payload)
      } else if (payload.conferenceId) {
        const details = payload as ConferenceStatusEvent
        setConferenceStatus(details)
        updateStreamsList(details.participants)
      }
    }
    socket.onerror = (error) => {
      console.error('SOCKET', error)
    }
    setHostSocket(socket)
    setMessage('Hi!')
  }

  const leave = () => {
    // TODO: Teardown socket host
    if (hostSocket) {
      hostSocket.close()
      setMessage('BYE')
    }
  }

  const exportedValues = {
    message,
    hostSocket,
    streamsList,
    conferenceStatus,
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
