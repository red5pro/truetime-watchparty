import { AccountCredentials } from './../../models/AccountCredentials'
import axios, { AxiosResponse } from 'axios'

import { MAIN_ENDPOINT } from '../../settings/variables'

const ENDPOINT = {
  SERIES: `${MAIN_ENDPOINT}/series`,
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

const createSerie = async (data: any, account: AccountCredentials) => {
  try {
    const params = {
      user: account.email,
      password: account.password,
    }
    const response: AxiosResponse = await axios.post(ENDPOINT.SERIES, data, { params })
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

export const SERIES_API_CALLS = {
  getSeriesList,
  createSerie,
}
