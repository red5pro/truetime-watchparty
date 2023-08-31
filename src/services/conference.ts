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
import { SERIES_API_CALLS } from './api/serie-api-calls'
import { Serie } from '../models/Serie'
import { AccountCredentials } from '../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from './api/conference-api-calls'
import { ERROR_TYPE } from '../utils/apiErrorMapping'
import { NextConferenceToJoin } from '../models/ConferenceStatusEvent'

export const getCurrentEpisode = async (retrieveNextEpisodes = true) => {
  let currentSerie: any
  let currentEpisode: any
  let nextEpisodes: any[] = []

  const promise1 = SERIES_API_CALLS.getSeriesList()
  const promise2 = CONFERENCE_API_CALLS.getCurrentEpisode()

  return Promise.allSettled([promise1, promise2]).then(async (results) => {
    let series

    if (results[0].status === 'fulfilled') {
      const seriesResponse = results[0].value
      if (!seriesResponse.data) throw { seriesResponse, error: ERROR_TYPE.NO_SERIES }

      series = seriesResponse.data.series
    } else {
      throw results[0].reason
    }

    if (results[1].status === 'fulfilled') {
      const episodeResponse = results[1].value
      if (!episodeResponse.data) throw { episodeResponse, error: ERROR_TYPE.NO_EPISODES }

      currentEpisode = episodeResponse.data

      currentSerie = series.find((s: Serie) => s.seriesId === currentEpisode.seriesId)
    } else {
      throw results[1].reason
    }

    if (retrieveNextEpisodes && currentEpisode) {
      const allEpisodesResponse = await SERIES_API_CALLS.getAllEpisodesBySerie(currentSerie.seriesId)
      if (allEpisodesResponse.status !== 200) throw allEpisodesResponse

      nextEpisodes = allEpisodesResponse.data ? allEpisodesResponse.data.episodes : []
      nextEpisodes = nextEpisodes.filter((e: any) => e.episodeId !== currentEpisode.episodeId)
    }
    return [currentEpisode, currentSerie, nextEpisodes]
  })
}

export const getConferenceDetails = async (conferenceId: string, account: AccountCredentials) => {
  return await CONFERENCE_API_CALLS.getConferenceDetails(conferenceId, account)
}

export const getConferenceParticipants = async (conferenceId: string, account: AccountCredentials) => {
  return await CONFERENCE_API_CALLS.getConferenceParticipants(conferenceId, account)
}

export const getNextConference = async (account: AccountCredentials) => {
  const response = await CONFERENCE_API_CALLS.getNextVipConference(account)

  if (response.status === 200) {
    if (Object.values(response.data).length) {
      const nextConf: NextConferenceToJoin = response.data

      const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(nextConf.conferenceId.toString(), account)

      if (confDetails.status === 200 && confDetails.data) {
        const confLoby = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

        if (confLoby.status === 200 && confLoby.data) {
          const nextConfResponse = {
            ...nextConf,
            ...confDetails.data,
            ...confLoby.data,
          }

          return { data: nextConfResponse, error: false }
        } else {
          return {
            data: null,
            error: true,
            title: 'Warning!',
            statusText: 'There was not found any loby configuration. Please check back later!',
          }
        }
      } else {
        return {
          data: null,
          error: true,
          title: 'Warning!',
          statusText: 'Could not access any configuration details. Please check back later!',
        }
      }
    }
  }
  return {
    data: null,
    error: true,
    title: 'Warning!',
    statusText: 'There are not any current events to join. Please check back later!',
  }
}
