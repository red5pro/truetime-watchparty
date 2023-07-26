import axios, { AxiosResponse } from 'axios'

import { AccountCredentials } from './../../models/AccountCredentials'
import { ParticipantMuteState } from './../../models/Participant'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { MAIN_ENDPOINT } from '../../settings/variables'
import { MOCK_API_CALLS } from './mock'
import { getOptionsParams, getQueryParamsAndOptions } from '../../utils/apiUtils'
import { ThirdParties } from '../../utils/commonUtils'

const ENDPOINT = {
  SERIES: `${MAIN_ENDPOINT}/series`,
  CONFERENCE: `${MAIN_ENDPOINT}/conference`,
  EPISODE: `${MAIN_ENDPOINT}/episode`,
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

const getConferenceDetails = async (conferenceId: string, account?: AccountCredentials) => {
  const id = parseInt(conferenceId) // Can come in as an integer or string

  try {
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/${id}`, config)
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
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.post(`${ENDPOINT.CONFERENCE}`, conference, config)
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
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.get(ENDPOINT.CONFERENCE, config)

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
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/${conferenceId}/participants`, config)
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
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/nextvip`, config)

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

const getVipConferenceList = async (account: AccountCredentials) => {
  try {
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/nextvip/debug`, config)

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

const lockConference = async (conferenceId: string | number, account: AccountCredentials) => {
  try {
    const { options, params } = getQueryParamsAndOptions(account)
    const kv = []
    for (const key in params) {
      kv.push(`${key}=${(params as any)[key]}`)
    }
    let url = `${ENDPOINT.CONFERENCE}/${conferenceId}/lock`
    if (kv.length > 0) {
      url = `${url}?${kv.join('&')}`
    }

    const response: AxiosResponse = await axios.put(url, options)
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
    const { options, params } = getQueryParamsAndOptions(account)
    const kv = []
    for (const key in params) {
      kv.push(`${key}=${(params as any)[key]}`)
    }
    let url = `${ENDPOINT.CONFERENCE}/${conferenceId}/unlock`
    if (kv.length > 0) {
      url = `${url}?${kv.join('&')}`
    }
    const response: AxiosResponse = await axios.put(url, options)
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
    const { options, params } = getQueryParamsAndOptions(account)
    const kv = []
    for (const key in params) {
      kv.push(`${key}=${(params as any)[key]}`)
    }
    let url = `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/mute`
    if (kv.length > 0) {
      url = `${url}?${kv.join('&')}`
    }

    const response: AxiosResponse = await axios.put(url, options, payload)
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
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.delete(
      `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/${id}`,
      config
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
  getCurrentEpisode,
  getConferenceDetails,
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
