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
import useCookies from '../../hooks/useCookies'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { FatalError } from '../../models/FatalError'
import { getCurrentEpisode, getNextConference } from '../../services/conference'
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

interface VipJoinContextProps {
  children: any
}

interface IVipJonContextProps {
  loading: boolean
  error: any
  fingerprint: string | undefined
  seriesEpisode: any
  currentConferenceData: ConferenceDetails | undefined
  nextVipConferenceDetails: ConferenceDetails | undefined
  getStreamGuid: () => string
  getNextConference: (isFirstCall: boolean) => Promise<boolean>
  setCurrentConferenceGetNext: () => Promise<void>
  setLoggedIn: (value: boolean) => void
  account: any
  setAccount: (value: any) => void
}

const VipJoinContext = React.createContext<IVipJonContextProps>({} as IVipJonContextProps)

const VipJoinProvider = (props: VipJoinContextProps) => {
  const { children } = props

  const uid = useUID()
  const { getCookies, removeCookie } = useCookies(['account', 'userAccount'])

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [joinToken, setJoinToken] = React.useState<string | null>(null)
  const [fingerprint, setFingerprint] = React.useState<string | undefined>(LocalStorage.get('wp_fingeprint'))
  // ConferenceDetails access from the server API.
  const [seriesEpisode, dispatch] = useReducer(episodeReducer, {
    loaded: false,
    series: cannedSeries,
    episode: cannedEpisode,
    locked: false,
  })
  const [currentConferenceData, setCurrentConferenceData] = React.useState<ConferenceDetails | undefined>()
  const [nextVipConferenceDetails, setNextVipConferenceDetails] = React.useState<ConferenceDetails>()
  const [account, setAccount] = React.useState<any>()
  const [ready, setReady] = React.useState<boolean>(false)
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false)

  React.useEffect(() => {
    const cookies = getCookies()
    const acc = cookies.userAccount
    if (acc) {
      const { role } = acc
      // We are dumping any previously entered account info if stored as non-VIP
      if (role !== UserRoles.VIP) {
        clearCookies()
      } else {
        setReady(true)
      }
    }
  }, [])

  React.useEffect(() => {
    if (ready || loggedIn) {
      getNextConferenceDetails(true)
    }
  }, [ready, loggedIn])

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

  const clearCookies = () => {
    removeCookie('userAccount')
    removeCookie('account')
  }

  /*--------------------------METHODS----------------------------------*/

  const getNextConferenceDetails = async (isFirstCall: boolean) => {
    const response = await getNextConference(getCookies().account)
    if (!response.error && response.data) {
      setNextVipConferenceDetails(response.data)
      return true
    } else {
      setNextVipConferenceDetails(undefined)

      if (isFirstCall) {
        setError({
          ...(error as any),
          title: response.title,
          closeLabel: 'CLOSE',
          statusText: response.statusText,
          onClose: () => {
            setError(undefined)
          },
        } as FatalError)
      }
      return false
    }
  }

  const setCurrentConferenceGetNext = async () => {
    if (nextVipConferenceDetails) {
      setCurrentConferenceData(nextVipConferenceDetails)
      setJoinToken(nextVipConferenceDetails.joinToken)
      await getNextConferenceDetails(false)
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
    // Only keep numbers and letters, otherwise stream may break.
    const append = 'vip'
    const stripped = 'VIP'
    let guid = `live/${append}_${stripped}_${uid}`
    if (!FORCE_LIVE_CONTEXT && joinToken) {
      guid = `${append?.split('-').join('')}/${stripped}_${uid}`
    }
    return guid
  }

  const exportedValues = {
    loading,
    error,
    fingerprint,
    seriesEpisode,
    currentConferenceData,
    getStreamGuid,
    nextVipConferenceDetails,
    getNextConference: getNextConferenceDetails,
    setCurrentConferenceGetNext,
    setLoggedIn,
    account,
    setAccount,
  }

  return <VipJoinContext.Provider value={exportedValues}>{children}</VipJoinContext.Provider>
}

export default {
  Context: VipJoinContext,
  Consumer: VipJoinContext.Consumer,
  Provider: VipJoinProvider,
}
