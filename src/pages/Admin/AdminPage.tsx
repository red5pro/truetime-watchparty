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
      setStatsByConference(response.data.statsByConferences || [])
      setAllConferenceStats(response.data.allConferecesStats || ({} as AllConferenceStats))
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
