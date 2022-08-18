import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'

export const getCurrentEpisode = async () => {
  let currentSerie
  let currentEpisode
  let nextEpisodes = []

  try {
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
  } catch (e: any) {
    console.log('Error on GetCurrentEpisode', e)

    return [currentEpisode, currentSerie, nextEpisodes]
  }
}
