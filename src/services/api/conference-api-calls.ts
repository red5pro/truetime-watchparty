import axios, { AxiosResponse } from 'axios'

import { AccountCredentials } from './../../models/AccountCredentials'
import { ParticipantMuteState } from './../../models/Participant'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { MAIN_ENDPOINT } from '../../settings/variables'
import { MOCK_API_CALLS } from './mock'

const ENDPOINT = {
  SERIES: `${MAIN_ENDPOINT}/series`,
  CONFERENCE: `${MAIN_ENDPOINT}/conference`,
  EPISODE: `${MAIN_ENDPOINT}/episode`,
}

const getSeriesList = async () => {
  try {
    const response: AxiosResponse = await axios.get(ENDPOINT.SERIES)
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getCurrentEpisode = async () => {
  try {
    const response: AxiosResponse = await axios.get(`${ENDPOINT.EPISODE}/current`)
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getAllEpisodesBySerie = async (serieId: number | string) => {
  try {
    const response: AxiosResponse = await axios.get(`${ENDPOINT.SERIES}/${serieId}/episode`)
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
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
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getJoinDetails = async (joinToken: string) => {
  try {
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/lobby?joinToken=${joinToken}`)
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const createConference = async (conference: ConferenceDetails, account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${ENDPOINT.CONFERENCE}?user=${account.email}&password=${account.password}`,
      conference
    )
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getAllConferences = async (account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.get(
      `${ENDPOINT.CONFERENCE}?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getConferenceLoby = async (joinToken: string) => {
  try {
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/lobby?joinToken=${joinToken}`)
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
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
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getNextVipConference = async (account: AccountCredentials) => {
  try {
    const params = {
      user: account.email,
      password: account.password,
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/nextvip`, { params })

    return response
  } catch (e: any) {
    // debugger
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const getVipConferenceList = async (account: AccountCredentials) => {
  try {
    const params = {
      user: account.email,
      password: account.password,
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/nextvip/debug`, { params })

    return response
  } catch (e: any) {
    // debugger
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code,
      statusText: message,
    } as AxiosResponse
  }
}

const lockConference = async (conferenceId: string | number, account: AccountCredentials) => {
  try {
    const response: AxiosResponse = await axios.put(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/lock?user=${account.email}&password=${account.password}`
    )
    return response
  } catch (e: any) {
    console.log(e)
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code || 400,
      statusText: message,
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
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      message = error
    }
    return {
      data: null,
      status: e.code || 400,
      statusText: message,
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
    const response: AxiosResponse = await axios.put(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/mute?user=${account.email}&password=${account.password}`,
      payload
    )
    return response
  } catch (e: any) {
    console.log(e)
    const code = e.code === 'ERR_BAD_REQUEST' ? 400 : e.code
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      if (error) {
        message = error
      }
    }
    return {
      data: null,
      status: code || 400,
      statusText: message,
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
    const code = e.code === 'ERR_BAD_REQUEST' ? 400 : e.code
    let message = e.message
    const { response } = e
    if (response && response.data) {
      const { error } = response.data
      if (error) {
        message = error
      }
    }
    return {
      data: null,
      status: code || 400,
      statusText: message,
    } as AxiosResponse
  }
}

export const CONFERENCE_API_CALLS = {
  getSeriesList,
  getCurrentEpisode,
  getAllEpisodesBySerie,
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
  getNextVipConference,
  getVipConferenceList,
}
