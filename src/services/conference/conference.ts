import { Serie } from './../../models/Serie'
import { AccountCredentials } from '../../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'

export const getCurrentEpisode = async () => {
  let currentSerie: any
  let currentEpisode: any
  let nextEpisodes = []

  try {
    const response = await CONFERENCE_API_CALLS.getSeriesList()
    const { data } = response
    if (!data) throw response

    if (response.status === 200 && data.series) {
      const { series } = data

      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode()
      if (!episodeResponse.data) throw episodeResponse

      if (episodeResponse.data && episodeResponse.status === 200) {
        currentEpisode = episodeResponse.data
      }
      currentSerie = series.find((s: Serie) => s.seriesId === currentEpisode.seriesId)

      const allEpisodesResponse = await CONFERENCE_API_CALLS.getAllEpisodes(currentSerie.seriesId)
      if (!allEpisodesResponse.data) throw allEpisodesResponse

      if (allEpisodesResponse.data && allEpisodesResponse.status === 200) {
        nextEpisodes = allEpisodesResponse.data ?? []
      }
      return [currentEpisode, currentSerie, nextEpisodes]
    }
    throw { data: null, status: response.status, statusText: `Could not access any series data.` }
  } catch (e) {
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
