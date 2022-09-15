import axios, { AxiosResponse } from 'axios'
import { MAIN_ENDPOINT } from '../../settings/variables'
import { apiErrorMapping } from '../../utils/apiErrorMapping'

const ENDPOINT = {
  STATS: `${MAIN_ENDPOINT}/stats`,
}

const getAllConferenceStats = async (user: string, password: string) => {
  try {
    const params = {
      user,
      password,
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.STATS}`, { params })

    return response
  } catch (e: any) {
    console.log(e)
    const msg = apiErrorMapping(e)

    return {
      data: null,
      status: msg.status,
      statusText: msg.statusText,
    } as AxiosResponse
  }
}

const getStatsByConference = async (user: string, password: string, conferenceId: number) => {
  try {
    const params = {
      user,
      password,
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.STATS}/${conferenceId}`, { params })

    return response
  } catch (e: any) {
    console.log(e)
    const msg = apiErrorMapping(e)

    return {
      data: null,
      status: msg.status,
      statusText: msg.statusText,
    } as AxiosResponse
  }
}

export const STATS_API_CALLS = {
  getAllConferenceStats,
  getStatsByConference,
}
