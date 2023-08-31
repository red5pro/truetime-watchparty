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
import React from 'react'
import { getCurrentEpisode } from '../../services/conference'

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
