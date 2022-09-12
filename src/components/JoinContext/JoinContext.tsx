import React, { useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { getCurrentEpisode } from '../../services/conference/conference'
import { FORCE_LIVE_CONTEXT } from '../../settings/variables'
import { generateFingerprint, UserRoles } from '../../utils/commonUtils'
import { LocalStorage } from '../../utils/localStorageUtils'

function useUID() {
  const [id] = React.useState<string | number>(() => {
    return Math.floor(Math.random() * 0x10000).toString(16)
  })
  return id
}

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

  const uid = useUID()
  const params = useParams()
  const navigate = useNavigate()
  const { getCookies } = useCookies(['account'])

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
    } else if (location.pathname === '/join/guest' || location.pathname === '/vip') {
      // TODO: Remove the `/vip`
      // Note: We'll access conferences through API for VIP.
      // Only want to know about current series/episode now...
      // setJoinToken('vip')
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
  // TODO: Be more clever when VIP...
  const getStreamGuid = () => {
    const isVIP = location.pathname === '/join/guest' || location.pathname === '/vip'
    if (!isVIP && !nickname) return null
    // Only keep numbers and letters, otherwise stream may break.
    const append = !isVIP ? joinToken : 'vip'
    const stripped = !isVIP ? nickname?.replace(/[^a-zA-Z0-9]/g, '') : 'VIP'
    let guid = `live/${append}_${stripped}_${uid}`
    if (!FORCE_LIVE_CONTEXT && joinToken) {
      guid = `${append?.split('-').join('')}/${stripped}_${uid}`
    }
    return guid
  }

  const getMainStreamGuid = () => {
    const { episode } = seriesEpisode
    return episode.streamGuid
  }

  const lock = async (conferenceId: string | number) => {
    if (conferenceData) {
      try {
        const result = await CONFERENCE_API_CALLS.lockConference(conferenceId, getCookies().account)
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
        const result = await CONFERENCE_API_CALLS.unlockConference(conferenceId, getCookies().account)
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
