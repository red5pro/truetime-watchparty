import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import Red5ProLogoSmall from '../../assets/logos/Red5ProLogoSmall'
import VerifyEmailAccount from '../../components/Account/Signin/VerifyEmailAccount'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import useCookies from '../../hooks/useCookies'
import { getQueryParams } from '../../utils/commonUtils'
import useStyles from './VerifyEmailPage.module'

const VerifyEmailPage = () => {
  const email = getQueryParams('email')
  const token = getQueryParams('token')

  const { removeCookie } = useCookies(['userAccount', 'account'])
  const { classes } = useStyles()
  const navigate = useNavigate()

  React.useEffect(() => {
    removeCookie('userAccount')
    removeCookie('account')
  }, [])

  return (
    <Box className={classes.root}>
      <Box>
        <Box padding={2} className={classes.brandLogo}>
          <Red5ProLogoSmall />
        </Box>
        <Box>
          <Typography padding={2} className={classes.joinTitleSmall}>
            Watch Party
          </Typography>
        </Box>
      </Box>
      {email && token && (
        <Box width="100%" display="flex" justifyContent="center">
          <VerifyEmailAccount email={email} token={token} />
        </Box>
      )}
      {!(email && token) && (
        <SimpleAlertDialog
          title="Error!"
          message="There are missing data to complete this process."
          onConfirm={() => navigate('/landing')}
          confirmLabel="Go To Landing Page"
        />
      )}
    </Box>
  )
}

export default VerifyEmailPage
