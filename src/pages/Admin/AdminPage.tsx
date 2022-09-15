import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
// import MainTotalValues from '../../components/Admin/MainTotalValues/MainTotalValues'
import TabsSection from '../../components/Admin/TabsSection/TabsSection'
import Loading from '../../components/Common/Loading/Loading'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import useCookies from '../../hooks/useCookies'
import { AllConferenceStats, StatsByConference } from '../../models/ConferenceStats'
import { STATS_API_CALLS } from '../../services/api/stats-api-calls'
import { getStatsByConference } from '../../services/conference/stats'
import { UserRoles } from '../../utils/commonUtils'
import useStyles from './AdminPage.module'

const AdminPage = () => {
  const [cookies, setCookies] = React.useState<any>()
  const [ready, setReady] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [allStats, setAllStats] = React.useState<AllConferenceStats>()
  const [statsByConference, setStatsByConference] = React.useState<StatsByConference[]>()
  const [error, setError] = React.useState<any>()

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
      getStats()
    }
  }, [ready])

  const getStats = async () => {
    const allStats = await STATS_API_CALLS.getAllConferenceStats(cookies.account.username, cookies.account.password)
    if (allStats.status === 200 && allStats.data) {
      setAllStats(allStats.data as AllConferenceStats)

      const statsByConference = await getStatsByConference(cookies.account.username, cookies.account.password)

      if (statsByConference.status === 200 && statsByConference.data) {
        setStatsByConference(statsByConference.data)
      } else {
        setError(
          setError({
            status: `Warning!`,
            statusText: `${statsByConference.statusText}. Please check back later!`,
          })
        )
      }
    } else {
      setError(
        setError({
          status: `Warning!`,
          statusText: `${allStats.statusText}. Please check back later!`,
        })
      )
    }

    setLoading(false)
  }

  return (
    <Box width="100%" className={classes.container}>
      <Box marginBottom={2}>
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
        <Typography padding={2} className={classes.topTitle}>
          Watch Party Admin
        </Typography>
      </Box>
      {loading && <Loading />}
      {/* {allStats && <MainTotalValues stats={allStats} />} */}
      {statsByConference && <TabsSection statsByConferece={statsByConference} />}
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
