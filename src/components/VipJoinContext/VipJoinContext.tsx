import React, { useReducer } from 'react'
import useCookies from '../../hooks/useCookies'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { NextVipConference } from '../../models/ConferenceStatusEvent'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { getCurrentEpisode } from '../../services/conference/conference'
import { FORCE_LIVE_CONTEXT } from '../../settings/variables'
import { generateFingerprint } from '../../utils/commonUtils'
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

interface VipJoinContextProps {
  children: any
  currConferenceDetails: ConferenceDetails | undefined
  nextConferenceDetails: ConferenceDetails | undefined
  nextConferences: NextVipConference[] | undefined
}

const VipJoinContext = React.createContext<any>(null)

const VipJoinProvider = (props: VipJoinContextProps) => {
  const { children, currConferenceDetails, nextConferences, nextConferenceDetails } = props

  const uid = useUID()
  const [cookies] = useCookies(['account', 'userAccount'])

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [joinToken, setJoinToken] = React.useState<string | null>(null)

  // TODO: Update this based on User record / Auth ?
  // TODO: Does this belong here or in an overarching Context ?
  const [fingerprint, setFingerprint] = React.useState<string | undefined>(LocalStorage.get('wp_fingeprint'))
  const [nickname, setNickname] = React.useState<string | undefined>(LocalStorage.get('wp_nickname' || undefined))
  // ConferenceDetails access from the server API.
  const [seriesEpisode, dispatch] = useReducer(episodeReducer, {
    loaded: false,
    series: cannedSeries,
    episode: cannedEpisode,
    locked: false,
  })

  const [currentConferenceData, setCurrentConferenceData] = React.useState<ConferenceDetails | undefined>()
  const [nextVipConferences, setVipNextConferences] = React.useState<NextVipConference[]>()
  const [nextVipConferenceDetails, setNextVipConferenceDetails] = React.useState<ConferenceDetails>()

  React.useEffect(() => {
    if (currConferenceDetails) {
      setCurrentConferenceData(currConferenceDetails)
      setJoinToken(currConferenceDetails.joinToken)
    }
  }, [currConferenceDetails])

  React.useEffect(() => {
    setVipNextConferences(nextConferences)
  }, [nextConferences])

  React.useEffect(() => {
    setNextVipConferenceDetails(nextConferenceDetails)
  }, [nextConferenceDetails])

  React.useEffect(() => {
    if (!fingerprint) {
      const fp = generateFingerprint()
      LocalStorage.set('wp_fingeprint', fp)
      setFingerprint(fp)
    }
  }, [fingerprint])

  React.useEffect(() => {
    if (!seriesEpisode.loaded) {
      getCurrentSeriesEpisodeData()
    }
  }, [seriesEpisode])

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
    const isVIP = location.pathname === '/join/guest'

    // Only keep numbers and letters, otherwise stream may break.
    const append = 'vip'
    const stripped = 'VIP'
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

  const getNextConference = async (nextConfs?: NextVipConference[]) => {
    // if (cookies.account) {
    //   // const response = await CONFERENCE_API_CALLS.getNextVipConference(cookies.account)

    //   if (response.status === 200 && Object.values(response.data).length) {
    //     const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(nextVipConf.conferenceId, cookies.account)
    //     const confLoby = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

    //     const { data } = confLoby
    //     if (data && confDetails.data) {
    //       setNextConferenceDetails(confDetails.data)
    //       setNextParticipants(data.participants)
    //     }

    //     return { confDetails: confDetails.data, participants: data.participants }
    //   }
    // }

    const nextVipConf = nextConfs ? nextConfs[0] : nextVipConferences ? nextVipConferences[0] : null

    if (nextVipConf) {
      const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(
        nextVipConf.conferenceId.toString(),
        cookies.account
      )

      if (confDetails.data) {
        setNextVipConferenceDetails(confDetails.data)

        nextConfs ? nextConfs.shift() : nextVipConferences?.shift()

        setVipNextConferences(nextConfs ?? nextVipConferences)

        return { confDetails: confDetails.data, nextConfList: nextConfs ?? nextVipConferences }
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
    currentConferenceData,
    setCurrentConferenceData,
    updateNickname: (value: string) => {
      setNickname(value)
      LocalStorage.set('wp_nickname', value)
    },
    getStreamGuid,
    getMainStreamGuid,
    setJoinToken,
    nextVipConferenceDetails,
    getNextConference,
  }

  return <VipJoinContext.Provider value={exportedValues}>{children}</VipJoinContext.Provider>
}

export default {
  Context: VipJoinContext,
  Consumer: VipJoinContext.Consumer,
  Provider: VipJoinProvider,
}
