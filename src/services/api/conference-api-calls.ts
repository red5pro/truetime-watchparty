import axios, { AxiosResponse } from 'axios'
import { IConference } from '../../models/Conference'
import { API_SERVER_HOST } from '../../settings/variables'

const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conferenceapi/1.0`

const ENDPOINT = {
  SERIES: `${MAIN_ENDPOINT}/series`,
  CONFERENCE: `${MAIN_ENDPOINT}/conference`,
}

const getSeriesList = async (email: string, password: string) => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.SERIES}?user=${email}&password=${password}`)
  // } catch (e: any) {
  //   console.log(e)
  // }

  return {
    data: {
      series: [
        {
          seriesId: 9991,
          displayName: 'Series 1',
        },
        {
          seriesId: 9992,
          displayName: 'Series 2',
        },
        {
          seriesId: 9993,
          displayName: 'Series 3',
        },
      ],
      status: 200,
    },
  } as AxiosResponse
}

const getCurrentEpisode = async (serieId: string, email: string, password: string) => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.SERIES}/${serieId}/episode/current?user=${email}&password=${password}`)
  // } catch (e: any) {
  //   console.log(e)
  // }

  return {
    data: {
      episode: {
        episodeId: 9991,
        displayName: 'Event 1',
        startTime: 1658677171000,
        endTime: 1658691571000,
      },
      status: 200,
    },
  } as AxiosResponse
}

const getAllEpisodes = async (serieId: string, email: string, password: string) => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.SERIES}/${serieId}/episode?user=${email}&password=${password}`)
  // } catch (e: any) {
  //   console.log(e)
  // }

  return {
    data: {
      episodes: [
        {
          episodeId: 1001,
          seriesId: 9991,
          displayName: 'Event 1',
          startTime: 1658763571000,
          endTime: 1658777971000,
        },
        {
          episodeId: 1002,
          seriesId: 9991,
          displayName: 'Event 2',
          startTime: 1658849971000,
          endTime: 1658864371000,
        },
        {
          episodeId: 1003,
          seriesId: 9991,
          displayName: 'Event 3',
          startTime: 1658936371000,
          endTime: 1658950771000,
        },
      ],
      status: 200,
    },
  } as AxiosResponse
}

const getConferenceDetails = async (conferenceid: any, email: string, password: string) => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/${conferenceid}?user=${email}&password=${password}`)
  // } catch (e: any) {
  //   console.log(e)
  // }

  const id = parseInt(conferenceid) // Can come in as an integer or string

  return {
    data: {
      conferenceId: id,
      streamGuid: 'live/mainscreen',
      displayName: 'My Conference',
      welcomeMessage: "Welcome to my conference! We're going to have a great time! You'll love it!",
      thankYouMessage: 'Thanks for joining, see you next time!',
      location: 'United States of America',
      maxParticipants: 8,
      joinToken: 'kXQu9dEH',
      joinLocked: false,
      vipOkay: true,
      startTime: 1660150337146,
    },
  } as AxiosResponse
}

const getJoinDetails = async (joinToken: string) => {
  return {
    data: {
      displayName: 'My Conference',
      welcomeMessage: 'Welcome to my conference! We\u0027re going to have a great time! You\u0027ll love it!',
      thankYouMessage: 'Thanks for joining, see you next time!',
      location: 'United States of America',
      maxParticipants: 10,
      joinLocked: false,
      vipOkay: true,
      startTime: 1660150337146,
      participants: [
        {
          displayName: 'LynardMaffeus',
          role: 'ORGANIZER',
        },
        {
          displayName: 'RolindaWilken',
          role: 'PARTICIPANT',
        },
        {
          displayName: 'OxnardFrankenheel',
          role: 'VIP',
        },
      ],
    },
  } as AxiosResponse
}

const createConference = async (conference: IConference, email: string, password: string) => {
  // try {
  //   const response: AxiosResponse = await axios.post(
  //     `${ENDPOINT.CONFERENCE}?user=${email}&password=${password}`,
  //     conference
  //   )

  //   return response
  // } catch (e: any) {
  //   console.log(e)

  //   return {
  //     data: null,
  //     status: e.code,
  //     statusText: e.message,
  //   } as AxiosResponse
  // }

  return {
    data: {
      conferenceId: 1,
    },
  } as AxiosResponse
}

export const CONFERENCE_API_CALLS = {
  getSeriesList,
  getCurrentEpisode,
  getAllEpisodes,
  getConferenceDetails,
  getJoinDetails,
  createConference,
}
