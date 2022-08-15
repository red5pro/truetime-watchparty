import * as React from 'react'
import { removeFromArray } from '../../utils/commonUtils'

interface IWatchProviderProps {
  children: any
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const [streamsList, setStreamsList] = React.useState<string[]>([])
  const [hostSocket, setHostSocket] = React.useState<any>()

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

  const join = (streamName: string) => {
    // TODO: Setup socket host
    leave()

    const isSecure = window.location.protocol.includes('https')
    const wsProtocol = isSecure ? 'wss' : 'ws'

    // hacked to support remote server while doing local development
    // const url = `${wsProtocol}://${SERVER_HOST}:8443?room=${roomName}&streamName=${streamName}`
    // const newHostSocket = new WebSocket(url)

    // newHostSocket.onmessage = function (message) {
    //   const payload = JSON.parse(message.data)
    //   if (roomName === payload.room) {
    //     processStreams(payload.streams, streamsList, roomName, streamName)
    //   }
    // }

    // setHostSocket(newHostSocket)
  }

  const leave = () => {
    // TODO: Teardown socket host
    if (hostSocket) {
      hostSocket.close()
    }
  }

  const exportedValues = {
    hostSocket,
    streamsList,
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
