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
    statusText: 'There are not any current events. Please check back later!',
  }
}
