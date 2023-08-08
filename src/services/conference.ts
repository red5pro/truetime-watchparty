import { SERIES_API_CALLS } from './api/serie-api-calls'
import { Serie } from '../models/Serie'
import { AccountCredentials } from '../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from './api/conference-api-calls'
import { ERROR_TYPE } from '../utils/apiErrorMapping'
import { NextConferenceToJoin } from '../models/ConferenceStatusEvent'

export const getCurrentEpisode = async (retrieveNextEpisodes = true) => {
  let currentSerie: any
  let currentEpisode: any
  let nextEpisodes = []

  try {
    const response = await SERIES_API_CALLS.getSeriesList()
    const { data } = response
    if (response.status !== 200) throw response
    if (!data) throw { response, error: ERROR_TYPE.NO_SERIES }

    if (data.series) {
      const { series } = data

      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode()
      if (episodeResponse.status !== 200) throw episodeResponse
      if (!episodeResponse.data) throw { episodeResponse, error: ERROR_TYPE.NO_EPISODES }

      currentEpisode = episodeResponse.data

      currentSerie = series.find((s: Serie) => s.seriesId === currentEpisode.seriesId)

      if (retrieveNextEpisodes && currentEpisode) {
        const allEpisodesResponse = await SERIES_API_CALLS.getAllEpisodesBySerie(currentSerie.seriesId)
        if (allEpisodesResponse.status !== 200) throw allEpisodesResponse

        nextEpisodes = allEpisodesResponse.data ? allEpisodesResponse.data.episodes : []
        nextEpisodes = nextEpisodes.filter((e: any) => e.episodeId !== currentEpisode.episodeId)
      }
      return [currentEpisode, currentSerie, nextEpisodes]
    }
    throw { data: null, status: response.status, statusText: `Could not access any series data.` }
  } catch (e: any) {
    console.error(e)
    throw e
  }
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
      const confLoby = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

      if (confDetails.status === 200 && confDetails.data && confLoby.status === 200 && confLoby.data) {
        const nextConfResponse = {
          ...nextConf,
          ...confDetails.data,
          ...confLoby.data,
        }

        return { data: nextConfResponse, error: false }
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
