import React, { useReducer } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { Serie } from '../../models/Serie'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { generateFingerprint, UserRoles } from '../../utils/commonUtils'
import { SessionStorage } from '../../utils/sessionStorageUtils'

const cannedSeries = { displayName: 'Accessing...' }
const cannedEpisode = { displayName: 'Accessing...', startTime: new Date().getTime() }
const episodeReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, loaded: true, series: action.series, episode: action.episode }
  }
}

interface JoinContextProps {
  children: any
}

const JoinContext = React.createContext<any>(null)

const JoinProvider = (props: JoinContextProps) => {
  const { children } = props

  const query = useQueryParams()
  const params = useParams()
  const navigate = useNavigate()

  const [joinToken, setJoinToken] = React.useState<string | null>(null)

  // TODO: Update this based on User record / Auth ?
  // TODO: Does this belong here or in an overarching Context ?
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT)
  const [fingerprint, setFingerprint] = React.useState<string | undefined>(SessionStorage.get('wp_fingerorint'))
  const [nickname, setNickname] = React.useState<string | undefined>(SessionStorage.get('wp_nickname' || undefined)) // TODO: get from participant context or session storage?
  // ConferenceDetails access from the server API.
  const [seriesEpisode, dispatch] = useReducer(episodeReducer, {
    loaded: false,
    series: cannedSeries,
    episode: cannedEpisode,
  })
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | undefined>()

  React.useEffect(() => {
    if (params && params.token) {
      setJoinToken(params.token)
    } else {
      navigate('/')
    }
  }, [params])

  React.useEffect(() => {
    if (!fingerprint) {
      const fp = generateFingerprint()
      SessionStorage.set('wp_fingeprint', fp)
      setFingerprint(fp)
    }
  }, [fingerprint])

  React.useEffect(() => {
    if (joinToken) {
      getConferenceData(joinToken)
    }
  }, [joinToken])

  React.useEffect(() => {
    if (!seriesEpisode.loaded) {
      getCurrentSeriesEpisodeData()
    }
  }, [seriesEpisode])

  const getConferenceData = async (token: string) => {
    try {
      const details = await CONFERENCE_API_CALLS.getJoinDetails(token)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  const getCurrentSeriesEpisodeData = async () => {
    try {
      const serieResponse = await CONFERENCE_API_CALLS.getSeriesList('email', 'password')
      const currentSeries = serieResponse.data.series[0]
      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(currentSeries.seriesId, 'email', 'password')
      const currentEpisode = episodeResponse.data.episode
      if (currentSeries && currentEpisode) {
        dispatch({ type: 'UPDATE', series: currentSeries, episode: currentEpisode })
      }
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  // Returns stream guid (context + name) of the current participant to broadcast on.
  const getStreamGuid = () => {
    // TODO: Strip special characters.
    return `live/${joinToken}_${nickname}`
  }

  const exportedValues = {
    nickname,
    joinToken,
    fingerprint,
    seriesEpisode,
    conferenceData,
    updateNickname: (value: string) => {
      setNickname(value)
      SessionStorage.set('wp_nickname', value)
    },
    getStreamGuid,
  }

  return <JoinContext.Provider value={exportedValues}>{children}</JoinContext.Provider>
}

export default {
  Context: JoinContext,
  Consumer: JoinContext.Consumer,
  Provider: JoinProvider,
}
