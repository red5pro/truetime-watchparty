/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import axios, { AxiosResponse } from 'axios'

import { AccountCredentials } from './../../models/AccountCredentials'
import { ParticipantMuteState } from './../../models/Participant'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { adminAccount, MAIN_ENDPOINT } from '../../settings/variables'
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

    const response: AxiosResponse = await axios.put(url, payload, options)
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

const updateCohostList = async (
  conferenceId: string | number,
  account: AccountCredentials,
  cohostEmailList: string[]
) => {
  try {
    const payload: any = { cohosts: cohostEmailList }

    // Temporary solution until API gets fixed -
    // TODO: replace 'adminAccount' with 'account'
    const config = getOptionsParams(account)

    const response: AxiosResponse = await axios.put(`${ENDPOINT.CONFERENCE}/${conferenceId}/cohosts`, payload, config)
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

const getCohostList = async (conferenceId: string | number, account: AccountCredentials) => {
  try {
    // Temporary solution until API gets fixed -
    // TODO: replace 'adminAccount' with 'account'
    const config = getOptionsParams(adminAccount)

    const response: AxiosResponse = await axios.get(`${ENDPOINT.CONFERENCE}/${conferenceId}/cohosts`, config)

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

const banParticipant = async (
  conferenceId: string | number,
  account: AccountCredentials,
  participantId: string | number
) => {
  try {
    const id = '' + participantId
    const { options, params } = getQueryParamsAndOptions(account)
    const kv = []
    for (const key in params) {
      kv.push(`${key}=${(params as any)[key]}`)
    }
    let url = `${ENDPOINT.CONFERENCE}/${conferenceId}/participants/${id}/ban`
    if (kv.length > 0) {
      url = `${url}?${kv.join('&')}`
    }
    const response: AxiosResponse = await axios.put(url, {}, options)
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

const kickParticipant = async (
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
  kickParticipant,
  getConferenceLoby,
  getNextVipConference,
  getVipConferenceList,
  updateCohostList,
  getCohostList,
}
