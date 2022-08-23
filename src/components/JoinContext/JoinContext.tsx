import React, { useReducer } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { Serie } from '../../models/Serie'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { generateFingerprint, UserRoles } from '../../utils/commonUtils'
import { LocalStorage } from '../../utils/localStorageUtils'

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
  const [cookies] = useCookies(['account'])

  const [joinToken, setJoinToken] = React.useState<string | null>(null)

  // TODO: Update this based on User record / Auth ?
  // TODO: Does this belong here or in an overarching Context ?
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT)
  const [fingerprint, setFingerprint] = React.useState<string | undefined>(LocalStorage.get('wp_fingerorint'))
  const [nickname, setNickname] = React.useState<string | undefined>(LocalStorage.get('wp_nickname' || undefined)) // TODO: get from participant context or session storage?
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
      setConferenceLocked(details.data.joinLocked)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  const getCurrentSeriesEpisodeData = async () => {
    try {
      const serieResponse = await CONFERENCE_API_CALLS.getSeriesList()
      const currentSeries = serieResponse.data.series[0]
      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(currentSeries.seriesId, cookies.account)
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

  const getMainStreamGuid = () => {
    const { episode } = seriesEpisode
    return episode.streamGuid
  }

  const lock = async () => {
    if (conferenceData) {
      const { conferenceId } = conferenceData
      try {
        const result = await CONFERENCE_API_CALLS.lockConference(conferenceId, cookies.account)
        return result
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }

  const unlock = async () => {
    if (conferenceData) {
      const { conferenceId } = conferenceData
      try {
        const result = await CONFERENCE_API_CALLS.unlockConference(conferenceId, cookies.account)
        return result
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }

  const exportedValues = {
    nickname,
    joinToken,
    fingerprint,
    seriesEpisode,
    conferenceData,
    conferenceLocked,
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
