import { Serie } from './../../models/Serie'
import { AccountCredentials } from '../../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'
import { ERROR_TYPE } from '../../utils/apiErrorMapping'

export const getCurrentEpisode = async (retrieveNextEpisodes = true) => {
  let currentSerie: any
  let currentEpisode: any
  let nextEpisodes = []

  try {
    const response = await CONFERENCE_API_CALLS.getSeriesList()
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

      if (retrieveNextEpisodes) {
        const allEpisodesResponse = await CONFERENCE_API_CALLS.getAllEpisodesBySerie(currentSerie.seriesId)
        if (allEpisodesResponse.status !== 200) throw allEpisodesResponse

        nextEpisodes = allEpisodesResponse.data ?? []
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
