import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import useCookies from '../../hooks/useCookies'
import { UserRoles } from '../../utils/commonUtils'
import useStyles from './AdminPage.module'

const AdminPage = () => {
  const [cookies, setCookies] = React.useState()
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
  }, [])

  return (
    <Box width="100%" height="100vh" className={classes.container}>
      <Box padding={2} className={classes.brandLogo}>
        <WbcLogoSmall />
      </Box>
      <Typography padding={2} className={classes.topTitle}>
        Watch Party Admin
      </Typography>
    </Box>
  )
}

export default AdminPage
