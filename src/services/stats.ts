import { AxiosResponse } from 'axios'
import { STATS_API_CALLS } from './api/stats-api-calls'
import { AccountCredentials } from '../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from './api/conference-api-calls'
import { StatsByConference } from '../models/ConferenceStats'

export const getStatsByConference = async (user: string, password: string) => {
  const account: AccountCredentials = {
    email: user,
    password: password,
  }
  const statsByConferences: StatsByConference[] = []
  const allConferencesPromise = CONFERENCE_API_CALLS.getAllConferences(account)
  const allConferecesStatsPromise = STATS_API_CALLS.getAllConferenceStats(user, password)

  return Promise.allSettled([allConferencesPromise, allConferecesStatsPromise])
    .then(async (results) => {
      if (results[0].status === 'fulfilled') {
        const allConferencesResponse = results[0].value
        if (allConferencesResponse.status === 200 && allConferencesResponse.data.conferences.length) {
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
        }
      } else {
        throw results[0].reason
      }
      if (results[1].status === 'fulfilled') {
        const allConferecesStatsResponse = results[1].value
        if (allConferecesStatsResponse.status === 200 && allConferecesStatsResponse.data) {
          return {
            data: { statsByConferences, allConferecesStats: allConferecesStatsResponse.data },
            status: 200,
          } as AxiosResponse
        }

        return {
          data: { statsByConferences },
          status: 200,
        } as AxiosResponse
      } else {
        throw results[1].reason
      }
    })
    .catch((reason: any) => {
      throw reason
    })
}
