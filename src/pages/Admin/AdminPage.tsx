import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import MainTotalValues from '../../components/Admin/MainTotalValues/MainTotalValues'
import TabsSection from '../../components/Admin/TabsSection/TabsSection'
import Loading from '../../components/Common/Loading/Loading'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import useCookies from '../../hooks/useCookies'
import { AllConferenceStats, StatsByConference } from '../../models/ConferenceStats'
import { STATS_API_CALLS } from '../../services/api/stats-api-calls'
import { getStatsByConference } from '../../services/conference/stats'
import { UserRoles } from '../../utils/commonUtils'
import { getSortedCountryList } from '../../utils/statsUtils'
import useStyles from './AdminPage.module'
import { Serie } from '../../models/Serie'
import { SERIES_API_CALLS } from '../../services/api/serie-api-calls'

const AdminPage = () => {
  const [cookies, setCookies] = React.useState<any>()
  const [ready, setReady] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [allStats, setAllStats] = React.useState<AllConferenceStats>()
  const [statsByConference, setStatsByConference] = React.useState<StatsByConference[]>()
  const [series, setSeries] = React.useState<Serie[]>([])
  const [countries, setCountries] = React.useState<{ country: string; count: number }[]>([])
  const [error, setError] = React.useState<any>()
  const [openCreatePage, setOpenCreatePage] = React.useState<boolean>(false)
  const [interval, setInt] = React.useState<any>()

  const { getCookies, removeCookie } = useCookies(['userAccount', 'account'])

  const navigate = useNavigate()
  const { classes } = useStyles()

  React.useEffect(() => {
    const cookiesUpdated = getCookies()

    if (cookiesUpdated?.userAccount?.role !== UserRoles.ADMIN) {
      removeCookie('userAccount')
      removeCookie('account')
      navigate('/login?r_id=admin')
      return
    }

    setCookies(cookiesUpdated)
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (ready && cookies && cookies.account.username && cookies.account.password) {
      setInt(setInterval(async () => await getStats(), 10000))
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [ready])

  const getStats = async () => {
    const allStats = await STATS_API_CALLS.getAllConferenceStats(cookies.account.username, cookies.account.password)

    if (allStats.status === 200 && allStats.data) {
      setAllStats(allStats.data as AllConferenceStats)
    } else {
      setError({
        status: `Got an error when trying to retrieve all stats.`,
        statusText: `${allStats.statusText}.`,
      })
    }

    const statsByConference = await getStatsByConference(cookies.account.username, cookies.account.password)

    if (statsByConference.status === 200 && statsByConference.data) {
      setStatsByConference(statsByConference.data)

      setCountries(getSortedCountryList(statsByConference.data))
    } else {
      setError({
        status: `Got an error when trying to retrieve conference stats.`,
        statusText: `${statsByConference.statusText}.`,
      })
    }

    await getSeries()

    setLoading(false)
    setReady(false)
  }

  const getSeries = async () => {
    const seriesResponse = await SERIES_API_CALLS.getSeriesList()

    if (seriesResponse.status === 200 && seriesResponse.data?.series) {
      setSeries(seriesResponse.data.series)
    }
  }

  return (
    <Box width="100%" minHeight="100%" display="flex" flexDirection="column" className={classes.container}>
      <Box marginBottom={1}>
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
        <Typography padding={2} className={classes.topTitle}>
          Watch Party Admin
        </Typography>
      </Box>

      {allStats && !openCreatePage && <MainTotalValues stats={allStats} />}
      {statsByConference && (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TabsSection
            statsByConferece={statsByConference}
            countries={countries}
            setError={setError}
            setLoading={setLoading}
            setOpenCreatePage={setOpenCreatePage}
            openCreatePage={openCreatePage}
            setReady={setReady}
            series={series}
            getSeries={getSeries}
          />
        </LocalizationProvider>
      )}
      {((!allStats && loading) || (!statsByConference && allStats)) && <Loading />}

      {error && (
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

export default AdminPage
