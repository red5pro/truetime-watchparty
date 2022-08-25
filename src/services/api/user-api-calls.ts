import axios, { AxiosResponse } from 'axios'
import { MAIN_ENDPOINT } from '../../settings/variables'
import { UserRoles } from '../../utils/commonUtils'

const ENDPOINT = {
  USER: `${MAIN_ENDPOINT}/user`,
}

const createUser = async (email: string, password: string, role?: string) => {
  try {
    const response: AxiosResponse = await axios.post(`${ENDPOINT.USER}`, {
      role: role ?? UserRoles.ORGANIZER,
      username: email,
      password: password,
    })

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

    return {
      data: null,
      status: e.code,
      statusText: e.message,
    } as AxiosResponse
  }
}

export const USER_API_CALLS = {
  createUser,
  signin,
}