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
        user: adminCredentials.email,
        password: adminCredentials.password,
      }
    }

    const response: AxiosResponse = await axios.post(
      `${ENDPOINT.USER}`,
      {
        role: role ?? UserRoles.ORGANIZER,
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Request-Method': '*',
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
      user: email,
      password: password,
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
      password,
    }
    encodeURIComponent
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

const getUsers = async (email: string, password: string) => {
  try {
    const params = {
      user: email,
      password: password,
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
}
