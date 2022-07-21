import * as React from 'react'
import { removeFromArray } from '../../utils/commonUtils'

interface IWatchProviderProps {
  children: any
}

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const [streamsList, setStreamsList] = React.useState<string[]>([])

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

  const exportedValues = {
    addSubscriber,
    removeSubscribers,
    streamsList,
  }

  return <WatchContext.Provider value={exportedValues}>{children}</WatchContext.Provider>
}

export default {
  Context: WatchContext,
  Consumer: WatchContext.Consumer,
  Provider: WatchProvider,
}
