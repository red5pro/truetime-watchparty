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
import { ThirdParties } from './../../utils/commonUtils'
import { AccountCredentials } from './../../models/AccountCredentials'
import axios, { AxiosResponse } from 'axios'
import { MAIN_ENDPOINT } from '../../settings/variables'
import { apiErrorMapping } from '../../utils/apiErrorMapping'
import { UserRoles } from '../../utils/commonUtils'

const ENDPOINT = {
  USER: `${MAIN_ENDPOINT}/user`,
}

const createUser = async (email: string, role?: string, adminCredentials?: AccountCredentials) => {
  try {
    let params = {}
    if (adminCredentials) {
      params = {
        user: encodeURIComponent(adminCredentials.email as string),
        password: encodeURIComponent(adminCredentials.password as string),
      }
    }

    const response: AxiosResponse = await axios.post(
      `${ENDPOINT.USER}`,
      {
        role: role ?? UserRoles.ORGANIZER,
        // username: encodeURIComponent(email),
        username: email,
      },
      { params }
    )

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

const signInFacebookUser = async (token: string) => {
  try {
    const params = { auth: ThirdParties.FACEBOOK }
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const response: AxiosResponse = await axios.get(`${ENDPOINT.USER}/whoami`, { params, headers })

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

const signin = async (email: string, password: string) => {
  try {
    const params = {
      user: encodeURIComponent(email),
      password: encodeURIComponent(password),
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.USER}/whoami`, { params })

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

const verifyAccount = async (email: string, password: string, token: string) => {
  try {
    const body = {
      token,
      password: encodeURIComponent(password),
    }

    const response: AxiosResponse = await axios.put(`${ENDPOINT.USER}/${encodeURIComponent(email)}/verify`, body)

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

const resetPassword = async (email: string) => {
  try {
    encodeURIComponent
    const response: AxiosResponse = await axios.put(`${ENDPOINT.USER}/${encodeURIComponent(email)}/reset`)

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

const getUsers = async (email: string, password: string) => {
  try {
    const params = {
      user: encodeURIComponent(email),
      password: encodeURIComponent(password),
    }
    const response: AxiosResponse = await axios.get(`${ENDPOINT.USER}`, { params })

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

export const USER_API_CALLS = {
  createUser,
  signin,
  verifyAccount,
  getUsers,
  signInFacebookUser,
  resetPassword,
}
