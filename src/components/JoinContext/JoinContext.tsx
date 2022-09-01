import React, { useReducer } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { getCurrentEpisode } from '../../services/conference/conference'
import { FORCE_LIVE_CONTEXT } from '../../settings/variables'
import { generateFingerprint, UserRoles } from '../../utils/commonUtils'
import { LocalStorage } from '../../utils/localStorageUtils'

const cannedSeries = { displayName: 'Accessing Information...' }
const cannedEpisode = { displayName: '...', startTime: new Date().getTime() }
const episodeReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, loaded: true, series: action.series, episode: action.episode }
    case 'TOGGLE_LOCK':
      return { ...state, locked: action.locked }
  }
}

interface JoinContextProps {
  children: any
}

const JoinContext = React.createContext<any>(null)

const JoinProvider = (props: JoinContextProps) => {
  const { children } = props

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
    locked: false,
  })
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | undefined>()
  // const [conferenceLocked, setConferenceLocked] = React.useState<boolean>(false)

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
      const details = await CONFERENCE_API_CALLS.getConferenceLoby(token)
      const { data } = details
      if (!data) throw details
      setConferenceData(data)
      dispatch({ type: 'TOGGLE_LOCK', locked: data.joinLocked })
      // setConferenceLocked(data.joinLocked)
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

      const [currentEpisode, currentSerie] = await getCurrentEpisode(false)

      if (currentSerie && currentEpisode) {
        dispatch({ type: 'UPDATE', series: currentSerie, episode: currentEpisode })
        setLoading(false)
      } else {
        throw { data: null, statusCode: 404, statusText: 'Could not locate Episode and Series information.' }
      }
    } catch (e: any) {
      console.error(e)
      setLoading(false)
      setError(e.error ?? e)
    }
  }

  // Returns stream guid (context + name) of the current participant to broadcast on.
  const getStreamGuid = () => {
    if (!nickname) return null

    // Only keep numbers and letters, otherwise stream may break.
    const stripped = nickname.replace(/[^a-zA-Z0-9]/g, '')
    const uid = Math.floor(Math.random() * 0x10000).toString(16)
    if (!FORCE_LIVE_CONTEXT && joinToken) {
      return `${joinToken?.split('-').join('')}/${stripped}_${uid}`
    }
    return `live/${joinToken}_${stripped}_${uid}`
  }

  const getMainStreamGuid = () => {
    const { episode } = seriesEpisode
    return episode.streamGuid
  }

  const lock = async (conferenceId: string | number) => {
    if (conferenceData) {
      try {
        const result = await CONFERENCE_API_CALLS.lockConference(conferenceId, cookies.account)
        if (result.status !== 200) {
          throw { data: null, status: result.status, statusText: `Could not unlock conference.` }
        }
        // setConferenceLocked(true)
        dispatch({ type: 'TOGGLE_LOCK', locked: true })
        return result
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return null
  }

  const unlock = async (conferenceId: string | number) => {
    if (conferenceData) {
      try {
        const result = await CONFERENCE_API_CALLS.unlockConference(conferenceId, cookies.account)
        if (result.status !== 200) {
          throw { data: null, status: result.status, statusText: `Could not unlock conference.` }
        }
        dispatch({ type: 'TOGGLE_LOCK', locked: true })

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
    // conferenceLocked,
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
