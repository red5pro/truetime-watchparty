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
import React, { useReducer } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { getCurrentEpisode } from '../../services/conference'
import { FORCE_LIVE_CONTEXT } from '../../settings/variables'
import { generateFingerprint, Paths, UserRoles } from '../../utils/commonUtils'
import { LocalStorage } from '../../utils/localStorageUtils'
import useQueryParams from '../../hooks/useQueryParams'

function useUID() {
  const [id] = React.useState<string | number>(() => {
    return Math.floor(Math.random() * 0x10000).toString(16)
  })
  return id
}
const anonReg = new RegExp(`^${Paths.ANONYMOUS}/`)

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
  const query = useQueryParams()
  const navigate = useNavigate()
  const { getCookies, removeCookie } = useCookies(['account', 'userAccount'])

  const path = useLocation().pathname
  // const isAnonymousParticipant = anonReg.exec(path)

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(false)
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
  const [cohostsList, setCohostsList] = React.useState<string[] | undefined>([])
  // const [conferenceLocked, setConferenceLocked] = React.useState<boolean>(false)

  const [isAnonymousParticipant, setIsAnonymousParticipant] = React.useState<boolean>(false)
  const [isMixerParticipant, setIsMixerParticipant] = React.useState<boolean>(false)
  const [mixerConfig, setMixerConfig] = React.useState<any>(null)

  React.useEffect(() => {
    const cookies = getCookies()
    const acc = cookies.userAccount
    if (acc) {
      const { role } = acc
      // We are dumping any previously entered account info if stored as VIP
      if (role === UserRoles.VIP) {
        clearCookies()
      }
    }
    setReady(true)
  }, [])

  React.useEffect(() => {
    const exec = anonReg.exec(path)
    const isAnon = exec !== null
    setIsAnonymousParticipant(isAnon)
  }, [path])

  React.useEffect(() => {
    if (query.get('mixer')) {
      const value = query.get('mixer') === 'true'
      setIsMixerParticipant(value)
    } else {
      setIsMixerParticipant(false)
    }
  }, [query])

  React.useEffect(() => {
    if (isMixerParticipant && !mixerConfig) {
      setMixerConfig({
        host: query.get('host'),
        streamName: query.get('streamName'),
      })
    }
  }, [query, isMixerParticipant])

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
    if (!seriesEpisode.loaded && ready) {
      getCurrentSeriesEpisodeData()
    }
  }, [ready])

  const clearCookies = () => {
    removeCookie('userAccount')
    removeCookie('account')
  }

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
    if (isAnonymousParticipant || (!isVIP && !nickname)) return null
    // Only keep numbers and letters, otherwise stream may break.
    const append = !isVIP ? joinToken : 'vip'
    const stripped = !isVIP ? nickname?.replace(/[^a-zA-Z0-9]/g, '') : 'VIP'
    let guid = `live/${append}_${stripped}_${uid}`
    if (!FORCE_LIVE_CONTEXT && joinToken) {
      guid = `${append?.split('-').join('')}/${stripped}_${uid}`
    }
    return guid
  }

  const getSharescreenStreamGuid = () => {
    return `${getStreamGuid()}_SCREENSHARE`
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
          throw { data: null, status: result.status, statusText: `Could not lock conference.` }
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
        dispatch({ type: 'TOGGLE_LOCK', locked: false })

        return result
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return null
  }

  const getCoHostsList = async (conferenceId: string) => {
    if (conferenceData) {
      try {
        const result = await CONFERENCE_API_CALLS.getCohostList(conferenceId, getCookies().account)
        if (result.status !== 200) {
          throw { data: null, status: result.status, statusText: `Could not get the cohost list of this conference.` }
        }
        setCohostsList(result.data || [])

        return result
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return null
  }

  const updateCoHostList = async (conferenceId: string, cohostEmailList: string[]) => {
    try {
      const result = await CONFERENCE_API_CALLS.updateCohostList(conferenceId, getCookies().account, cohostEmailList)
      if (result.status === 200) {
        setCohostsList(cohostEmailList || [])
      }

      return result
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const exportedValues = {
    loading,
    error,
    nickname,
    joinToken,
    fingerprint,
    seriesEpisode,
    conferenceData,
    isAnonymousParticipant,
    isMixerParticipant,
    mixerConfiguration: mixerConfig,
    // conferenceLocked,
    cohostsList,

    setConferenceData,
    updateNickname: (value: string) => {
      setNickname(value)
      LocalStorage.set('wp_nickname', value)
    },
    getStreamGuid,
    getSharescreenStreamGuid,
    getMainStreamGuid,
    setJoinToken,
    lock,
    unlock,
    getCoHostsList,
    updateCoHostList,
  }

  return <JoinContext.Provider value={exportedValues}>{children}</JoinContext.Provider>
}

export default {
  Context: JoinContext,
  Consumer: JoinContext.Consumer,
  Provider: JoinProvider,
}
