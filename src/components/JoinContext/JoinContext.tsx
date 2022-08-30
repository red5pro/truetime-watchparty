import React, { useReducer } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { Serie } from '../../models/Serie'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { FORCE_LIVE_CONTEXT } from '../../settings/variables'
import { generateFingerprint, UserRoles } from '../../utils/commonUtils'
import { LocalStorage } from '../../utils/localStorageUtils'

const cannedSeries = { displayName: 'Accessing Information...' }
const cannedEpisode = { displayName: '...', startTime: new Date().getTime() }
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
  const [cookies] = useCookies(['account'])

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [joinToken, setJoinToken] = React.useState<string | null>(null)

  // TODO: Update this based on User record / Auth ?
  // TODO: Does this belong here or in an overarching Context ?
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT)
  const [fingerprint, setFingerprint] = React.useState<string | undefined>(LocalStorage.get('wp_fingeprint'))
  const [nickname, setNickname] = React.useState<string | undefined>(LocalStorage.get('wp_nickname' || undefined))
  // ConferenceDetails access from the server API.
  const [seriesEpisode, dispatch] = useReducer(episodeReducer, {
    loaded: false,
    series: cannedSeries,
    episode: cannedEpisode,
  })
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | undefined>()
  const [conferenceLocked, setConferenceLocked] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (params && params.token) {
      setJoinToken(params.token)
    } else if (location.pathname === '/join/guest') {
      setJoinToken('')
    } else {
      navigate('/')
    }
  }, [params])

  React.useEffect(() => {
    if (!fingerprint) {
      const fp = generateFingerprint()
      LocalStorage.set('wp_fingeprint', fp)
      setFingerprint(fp)
    }
  }, [fingerprint])

  React.useEffect(() => {
    if (joinToken && !conferenceData) {
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
      setLoading(true)
      const details = await CONFERENCE_API_CALLS.getJoinDetails(token)
      const { data } = details
      if (!data) throw details
      setConferenceData(data)
      setConferenceLocked(data.joinLocked)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(e)
    }
  }

  const getCurrentSeriesEpisodeData = async () => {
    try {
      setLoading(true)
      const serieResponse = await CONFERENCE_API_CALLS.getSeriesList()
      if (!serieResponse.data) throw serieResponse

      const currentSeries = serieResponse.data.series[serieResponse.data.series.length - 1]
      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(cookies.account)
      if (!episodeResponse.data) throw episodeResponse

      const currentEpisode = episodeResponse.data
      if (currentSeries && currentEpisode) {
        dispatch({ type: 'UPDATE', series: currentSeries, episode: currentEpisode })
        setLoading(false)
      } else {
        throw { data: null, statusCode: 404, statusText: 'Could not locate Episode and Series information.' }
      }
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(e)
    }
  }

  // Returns stream guid (context + name) of the current participant to broadcast on.
  const getStreamGuid = () => {
    if (!nickname) return null

    // Only keep numbers and letters, otherwise stream may break.
    const stripped = nickname.replace(/[^a-zA-Z0-9]/g, '')
    if (!FORCE_LIVE_CONTEXT && joinToken) {
      return `${joinToken?.split('-').join('')}/${stripped}`
    }
    return `live/${joinToken}_${stripped}`
  }

  const getMainStreamGuid = () => {
    const { episode } = seriesEpisode
    return episode.streamGuid
  }

  const lock = async () => {
    if (conferenceData) {
      const { conferenceId } = conferenceData
      try {
        const result = await CONFERENCE_API_CALLS.lockConference(conferenceId, cookies.account)
        setConferenceLocked(true)
        return result
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return null
  }

  const unlock = async () => {
    if (conferenceData) {
      const { conferenceId } = conferenceData
      try {
        const result = await CONFERENCE_API_CALLS.unlockConference(conferenceId, cookies.account)
        setConferenceLocked(false)
        return result
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return null
  }

  const exportedValues = {
    loading,
    error,
    nickname,
    joinToken,
    fingerprint,
    seriesEpisode,
    conferenceData,
    conferenceLocked,
    setConferenceData,
    updateNickname: (value: string) => {
      setNickname(value)
      LocalStorage.set('wp_nickname', value)
    },
    getStreamGuid,
    getMainStreamGuid,
    setJoinToken,
    lock,
    unlock,
  }

  return <JoinContext.Provider value={exportedValues}>{children}</JoinContext.Provider>
}

export default {
  Context: JoinContext,
  Consumer: JoinContext.Consumer,
  Provider: JoinProvider,
}
