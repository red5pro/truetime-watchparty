import { AccountCredentials } from '../../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'

export const getCurrentEpisode = async () => {
  let currentSerie
  let currentEpisode
  let nextEpisodes = []

  try {
    const response = await CONFERENCE_API_CALLS.getSeriesList()
    const { data } = response
    if (!data) throw response

    if (response.status === 200 && data.series) {
      const seriesList = data.series
      // check this
      currentSerie = seriesList[seriesList.length - 1]

      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(currentSerie.seriesId)
      if (!episodeResponse.data) throw episodeResponse

      const allEpisodesResponse = await CONFERENCE_API_CALLS.getAllEpisodes(currentSerie.seriesId)
      if (!allEpisodesResponse.data) throw allEpisodesResponse

      if (episodeResponse.data && episodeResponse.status === 200) {
        currentEpisode = episodeResponse.data
      }

      if (allEpisodesResponse.data && allEpisodesResponse.status === 200) {
        nextEpisodes = allEpisodesResponse.data ?? []
      }
    }

    return [currentEpisode, currentSerie, nextEpisodes]
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getAllConferences = async (account: AccountCredentials) => {
  return await CONFERENCE_API_CALLS.getAllConferences(account)
}

export const getConferenceDetails = async (conferenceId: string, account: AccountCredentials) => {
  return await CONFERENCE_API_CALLS.getConferenceDetails(conferenceId, account)
}

export const getConferenceParticipants = async (conferenceId: string, account: AccountCredentials) => {
  return await CONFERENCE_API_CALLS.getConferenceParticipants(conferenceId, account)
}
