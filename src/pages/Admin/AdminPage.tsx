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
import { getStatsByConference } from '../../services/stats'
import { UserRoles } from '../../utils/commonUtils'
import useStyles from './AdminPage.module'
import { isWatchParty } from '../../settings/variables'

const AdminPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [cookies, setCookies] = React.useState<any>()
  const [error, setError] = React.useState<any>()
  const [openCreatePage, setOpenCreatePage] = React.useState<boolean>(false)

  const { getCookies, removeCookie } = useCookies(['userAccount', 'account'])
  const navigate = useNavigate()
  const { classes } = useStyles()

  const [statsByConference, setStatsByConference] = React.useState<StatsByConference[]>([])
  const [allConferenceStats, setAllConferenceStats] = React.useState<AllConferenceStats>({} as AllConferenceStats)

  React.useEffect(() => {
    const cookiesUpdated = getCookies()

    if (cookiesUpdated?.userAccount?.role !== UserRoles.ADMIN) {
      removeCookie('userAccount')
      removeCookie('account')
      navigate('/login?r_id=admin')
    } else {
      setCookies(cookiesUpdated)
      getStats(cookiesUpdated)
    }
  }, [])

  const getStats = async (cookies: any) => {
    const response = await getStatsByConference(cookies.account.username, cookies.account.password)

    if (response.status === 200 && response.data) {
      setStatsByConference(response.data.statsByConferences)
      setAllConferenceStats(response.data.allConferecesStats)
    } else {
      setError({
        status: `Warning!`,
        statusText: `${response.statusText}`,
      })
    }

    setLoading(false)
  }

  return (
    <Box width="100%" minHeight="100%" display="flex" flexDirection="column" className={classes.container}>
      {isWatchParty ? (
        <Box marginBottom={1}>
          <Box padding={2} className={classes.brandLogo}>
            <WbcLogoSmall />
          </Box>
          <Typography padding={2} className={classes.topTitle}>
            Watch Party Admin
          </Typography>
        </Box>
      ) : (
        <Box marginBottom={1}>
          <Typography padding={2} className={classes.topTitle}>
            Webinar Admin
          </Typography>
        </Box>
      )}
      {loading && <Loading />}

      {!loading && !openCreatePage && cookies && allConferenceStats && (
        <MainTotalValues stats={allConferenceStats} cookies={cookies} />
      )}

      {!loading && cookies && statsByConference && (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TabsSection
            cookies={cookies}
            statsByConference={statsByConference}
            setError={setError}
            setOpenCreatePage={setOpenCreatePage}
            openCreatePage={openCreatePage}
          />
        </LocalizationProvider>
      )}

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

