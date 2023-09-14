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
import { AxiosResponse } from 'axios'
import { STATS_API_CALLS } from './api/stats-api-calls'
import { AccountCredentials } from '../models/AccountCredentials'
import { CONFERENCE_API_CALLS } from './api/conference-api-calls'
import { StatsByConference } from '../models/ConferenceStats'

export const getStatsByConference = async (user: string, password: string) => {
  const account: AccountCredentials = {
    email: encodeURIComponent(user),
    password: encodeURIComponent(password),
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
