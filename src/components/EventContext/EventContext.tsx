import React from 'react'
import { getCurrentEpisode } from '../../services/conference/conference'

const cannedSeries = { displayName: 'Accessing Information...' }
const cannedEpisode = { displayName: '...', startTime: new Date().getTime() }
const eventReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        loaded: true,
        currentSeries: action.series,
        currentEpisode: action.episode,
        nextEpisodes: action.next,
      }
  }
}

interface EventContextProps {
  children: any
}

const EventContext = React.createContext<any>(null)

const EventProvider = (props: EventContextProps) => {
  const { children } = props

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(false)

  const [eventData, dispatch] = React.useReducer(eventReducer, {
    loaded: false,
    currentSeries: cannedSeries,
    currentEpisode: cannedEpisode,
    nextEpisodes: [],
  })

  React.useEffect(() => {
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (!eventData.loaded && ready) {
      load()
    }
  }, [ready])

  const load = async () => {
    setLoading(true)
    try {
      const [currentEpisode, currentSerie, nextEpisodes] = await getCurrentEpisode()
      dispatch({
        type: 'UPDATE',
        episode: currentEpisode,
        series: currentSerie,
        next: nextEpisodes,
      })
    } catch (e: any) {
      console.error(e)
      setError(e.error ?? e)
    } finally {
      setLoading(false)
    }
  }

  const exportedValues = {
    loading,
    error,
    eventData,
  }

  return <EventContext.Provider value={exportedValues}>{children}</EventContext.Provider>
}

export default {
  Context: EventContext,
  Consumer: EventContext.Consumer,
  Provider: EventProvider,
}
