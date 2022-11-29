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
        clearInterval(interval)
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

