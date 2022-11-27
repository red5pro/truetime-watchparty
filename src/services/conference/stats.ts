import { AxiosResponse } from 'axios'
import { STATS_API_CALLS } from './../api/stats-api-calls'
import { AccountCredentials } from '../../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from '../api/conference-api-calls'
import { StatsByConference } from '../../models/ConferenceStats'

export const getStatsByConference = async (user: string, password: string) => {
  const account: AccountCredentials = {
    email: user,
    password: password,
  }
  const allConferencesResponse = await CONFERENCE_API_CALLS.getAllConferences(account)

  if (allConferencesResponse.status === 200 && allConferencesResponse.data.conferences.length) {
    const statsByConferences: StatsByConference[] = []
    const results = []

    for (let i = 0; i < allConferencesResponse.data.conferences.length; i++) {
      const response = await STATS_API_CALLS.getStatsByConference(
        user,
        password,
        allConferencesResponse.data.conferences[i].conferenceId
      )

      if (response.status === 200 && Object.values(response.data).length) {
        statsByConferences.push({ ...response.data, ...allConferencesResponse.data.conferences[i] })
        results.push(response)
      }
    }

    return {
      data: statsByConferences,
      status: 200,
    } as AxiosResponse
  } else {
    return allConferencesResponse as AxiosResponse
  }
}
