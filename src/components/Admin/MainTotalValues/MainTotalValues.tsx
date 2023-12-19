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
import * as React from 'react'

import Box from '@mui/material/Box'

import CardComponent from './CardComponent'
import { AllConferenceStats } from '../../../models/ConferenceStats'
import { STATS_API_CALLS } from '../../../services/api/stats-api-calls'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'

interface IMainTotalValuesProps {
  stats: AllConferenceStats
  cookies: any
}

const MainTotalValues = ({ cookies, stats }: IMainTotalValuesProps) => {
  const [error, setError] = React.useState<any>()
  const [allStats, setAllStats] = React.useState<AllConferenceStats>(stats)
  const [interval, setInt] = React.useState<any>()

  // Set Interval
  const action = async () => {
    const fetchStats = await STATS_API_CALLS.getAllConferenceStats(cookies.account.username, cookies.account.password)

    if (fetchStats.status === 200 && fetchStats.data) {
      setAllStats(fetchStats.data as AllConferenceStats)
    } else {
      setError({
        status: `Got an error when trying to retrieve all stats.`,
        statusText: `${fetchStats.statusText}.`,
      })
    }
  }

  React.useEffect(() => {
    if (cookies) {
      setInt(setInterval(async () => await action(), 10000))
    }

    return () => {
      if (interval) {
        clearInterval(interval as any)
      }
    }
  }, [])

  return (
    <Box display="flex" justifyContent="space-around">
      {!error ? (
        <>
          <CardComponent text="Number of active main feed viewers" value={allStats.curParticipants} />
          <CardComponent text="Number of active conferences" value={allStats.curConferences} />
          <CardComponent text="Average number of participants per conference" value={allStats.avgParticipants} />
          <CardComponent text="Average conference length in seconds" value={allStats.avgViewTimeS} />
        </>
      ) : (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Ok"
          onConfirm={() => setError(null)}
        />
      )}
    </Box>
  )
}

export default MainTotalValues
