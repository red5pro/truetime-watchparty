import { ParticipantMuteState } from './../../models/Participant'
import axios, { AxiosResponse } from 'axios'
import { AccountCredentials } from '../../models/AccountCredentials'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { MAIN_ENDPOINT } from '../../settings/variables'

const ENDPOINT = {
  SERIES: `${MAIN_ENDPOINT}/series`,
  CONFERENCE: `${MAIN_ENDPOINT}/conference`,
}

const getSeriesList = async () => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.SERIES}`)
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
      series: [
        {
          seriesId: 9991,
          displayName: 'Series 1',
          maxParticipants: 8,
        },
        {
          seriesId: 9992,
          displayName: 'Series 2',
          maxParticipants: 8,
        },
        {
          seriesId: 9993,
          displayName: 'Series 3',
          maxParticipants: 8,
        },
      ],
      status: 200,
    },
  } as AxiosResponse
}

const getCurrentEpisode = async (serieId: string, account?: AccountCredentials) => {
  // try {
  //   let url = `${ENDPOINT.SERIES}/${serieId}/episode/current`
  //   if (account) {
  //     url += `?user=${account.email}&password=${account.password}`
  //   }
  //   const response: AxiosResponse = await axios.get(url)
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
      episode: {
        episodeId: 9991,
        displayName: 'Event 1',
        description: 'Event1',
        startTime: 1658677171000,
        endTime: 1658691571000,
        streamGuid: 'live/mainscreen',
      },
      status: 200,
    },
  } as AxiosResponse
}

const getAllEpisodes = async (serieId: string, account?: AccountCredentials) => {
  // try {
  //   let url = `${ENDPOINT.SERIES}/${serieId}/episode`
  //   if (account) {
  //     url += `?user=${account.email}&password=${account.password}`
  //   }
  //   const response: AxiosResponse = await axios.get(url)
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
      episodes: [
        {
          episodeId: 1001,
          seriesId: 9991,
          displayName: 'Event 1',
          description: 'Event1',
          startTime: 1658763571000,
          endTime: 1658777971000,
          streamGuid: 'live/mainscreen',
        },
        {
          episodeId: 1002,
          seriesId: 9991,
          displayName: 'Event 2',
          description: 'Event2',
          startTime: 1658849971000,
          endTime: 1658864371000,
          streamGuid: 'live/mainscreen',
        },
        {
          episodeId: 1003,
          seriesId: 9991,
          displayName: 'Event 3',
          description: 'Event3',
          startTime: 1658936371000,
          endTime: 1658950771000,
          streamGuid: 'live/mainscreen',
        },
      ],
      status: 200,
    },
  } as AxiosResponse
}

const getConferenceDetails = async (conferenceId: string, account?: AccountCredentials) => {
  const id = parseInt(conferenceId) // Can come in as an integer or string

  try {
    let params = {}
    if (account) {
      params = {
        user: account.email,
        password: account.password,
      }
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/${id}`, { params })
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code,
      statusText: e.message,
    } as AxiosResponse
  }

  return {
    data: {
      conferenceId: id,
      displayName: 'My Conference',
      welcomeMessage: "Welcome to my conference! We're going to have a great time! You'll love it!",
      thankYouMessage: 'Thanks for joining, see you next time!',
      location: 'United States of America',
      joinToken: 'kXQu9dEH',
      joinLocked: false,
      vipOkay: true,
      startTime: 1660150337146,
    },
  } as AxiosResponse
}

const getJoinDetails = async (joinToken: string) => {
  // try {
  //   const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}?joinToken=${joinToken}`)
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
      displayName: 'My Conference',
      welcomeMessage: 'Welcome to my conference! We\u0027re going to have a great time! You\u0027ll love it!',
      thankYouMessage: 'Thanks for joining, see you next time!',
      location: 'United States of America',
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

const createConference = async (conference: ConferenceDetails, account: AccountCredentials) => {
  // try {
  //   const response: AxiosResponse = await axios.post(
  //     `${ENDPOINT.CONFERENCE}?user=${account.email}&password=${account.password}`,
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

const getAllConferences = async (account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ENDPOINT.CONFERENCE}?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code,
      statusText: e.message,
    } as AxiosResponse
  }
}

const getConferenceLoby = async (joinToken: string) => {
  try {
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/lobby?joinToken=${joinToken}`)
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code,
      statusText: e.message,
    } as AxiosResponse
  }
}

const getConferenceParticipants = async (conferenceId: string, account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/participants?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code,
      statusText: e.message,
    } as AxiosResponse
  }
}

const lockConference = async (conferenceId: string | number, account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/lock?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code || 400,
      statusText: e.message,
    } as AxiosResponse
  }
}

const unlockConference = async (conferenceId: string | number, account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.put(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/unlock?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code || 400,
      statusText: e.message,
    } as AxiosResponse
  }
}

const muteParticipant = async (
  conferenceId: string | number,
  account: AccountCredentials,
  participantId: string | number,
  participantMuteState: ParticipantMuteState
) => {
  try {
    const id = '' + participantId
    const payload: any = {}
    payload[id] = participantMuteState
    const response: AxiosResponse = await axios.post(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/mute?user=${account.email}&password=${account.password}`,
      payload
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code || 400,
      statusText: e.message,
    } as AxiosResponse
  }
}

const banParticipant = async (
  conferenceId: string | number,
  account: AccountCredentials,
  participantId: string | number
) => {
  try {
    const id = '' + participantId
    const response: AxiosResponse = await axios.delete(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/${id}?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    return {
      data: null,
      status: e.code || 400,
      statusText: e.message,
    } as AxiosResponse
  }
}

export const CONFERENCE_API_CALLS = {
  getSeriesList,
  getCurrentEpisode,
  getAllEpisodes,
  getConferenceDetails,
  getJoinDetails,
  createConference,
  getAllConferences,
  getConferenceParticipants,
  lockConference,
  unlockConference,
  muteParticipant,
  banParticipant,
  getConferenceLoby,
}
