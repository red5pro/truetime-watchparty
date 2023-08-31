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

const createEpisode = async (serieId: number | string, data: any, account: AccountCredentials) => {
  try {
    const params = {
      user: account.email,
      password: account.password,
    }

    const response: AxiosResponse = await axios.post(`${ENDPOINT.SERIES}/${serieId}/episode`, data, { params })
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
  getAllEpisodesBySerie,
  createEpisode,
}
