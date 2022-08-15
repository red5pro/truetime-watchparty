import * as React from 'react'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { ConferenceStatusEvent } from '../../models/ConferenceStatusEvent'
import { removeFromArray } from '../../utils/commonUtils'

interface IWatchProviderProps {
  children: any
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const [message, setMessage] = React.useState<string>('')
  const [hostSocket, setHostSocket] = React.useState<any>()
  const [streamsList, setStreamsList] = React.useState<string[]>([])
  const [conferenceStatus, setConferenceStatus] = React.useState<ConferenceStatusEvent | undefined>()

  const addSubscriber = (name: string) => {
    const list = [...streamsList, name]
    setStreamsList(list)
    return list
  }

  const removeSubscribers = (items: string[]) => {
    const updatedList = removeFromArray(streamsList, items)
    setStreamsList(updatedList)
    return updatedList
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
    }
    socket.onerror = (error) => {
      console.error('SOCKET', error)
      fakeData()
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

  const fakeData = () => {
    const data = {
      conferenceId: 1,
      streamGuid: 'live/mainscreen',
      displayName: 'My Conference',
      maxParticipants: 10,
      focusParticipantId: 0,
      joinToken: 'kXQu9dEH',
      joinLocked: false,
      vipOkay: true,
      startTime: 1659632463712,
      participants: [
        {
          participantId: 2,
          conferenceId: 1,
          displayName: 'LynardMaffeus',
          role: 'PARTICIPANT',
          muteState: {
            audio: true,
            video: true,
            chat: true,
          },
        },
        {
          participantId: 3,
          conferenceId: 1,
          streamGuid: 'live/stream1',
          displayName: 'LynardMaffeus',
          role: 'PARTICIPANT',
          muteState: {
            audio: true,
            video: true,
            chat: true,
          },
        },
      ],
    } as ConferenceStatusEvent
    setConferenceStatus(data)
  }

  const exportedValues = {
    message,
    hostSocket,
    streamsList,
    conferenceStatus,
    join,
    leave,
    addSubscriber,
    removeSubscribers,
  }

  return <WatchContext.Provider value={exportedValues}>{children}</WatchContext.Provider>
}

export default {
  Context: WatchContext,
  Consumer: WatchContext.Consumer,
  Provider: WatchProvider,
}
