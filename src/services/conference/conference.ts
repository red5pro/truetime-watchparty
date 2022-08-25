import { AccountCredentials } from '../../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'

export const getCurrentEpisode = async () => {
  let currentSerie
  let currentEpisode
  let nextEpisodes = []

  const response = await CONFERENCE_API_CALLS.getSeriesList()

  if (response.data.status === 200 && response.data.series) {
    const seriesList = response.data.series

    // check this
    currentSerie = seriesList[0]

    const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(seriesList[0].seriesId)
    const allEpisodesResponse = await CONFERENCE_API_CALLS.getAllEpisodes(seriesList[0].seriesId)

    if (episodeResponse.data.episode && episodeResponse.data.status === 200) {
      currentEpisode = episodeResponse.data.episode
    }

    if (allEpisodesResponse.data.episodes && allEpisodesResponse.data.status === 200) {
      nextEpisodes = allEpisodesResponse.data.episodes ?? []
    }
  }

  return [currentEpisode, currentSerie, nextEpisodes]
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
