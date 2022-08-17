import * as React from 'react'
import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import useStyles from './VipJoinPage.module'
import { Episode } from '../../models/Episode'
import { getCurrentEpisode } from '../../services/conference/conference'

const VipJoinPage = () => {
  const [account, setAccount] = React.useState<any>()
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()

  const [cookies] = useCookies(['account'])
  const { classes } = useStyles()

  React.useEffect(() => {
    if (cookies.account) {
      setAccount(cookies.account)
      getCurrentEvent()

      setCurrentEpisode(currentEpisode)
    }
  }, [cookies])

  const getCurrentEvent = async () => {
    const [currentEpisode] = await getCurrentEpisode()

    setCurrentEpisode(currentEpisode)
  }

  console.log({ currentEpisode })

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" paddingX={8} className={classes.root}>
      {!account ? (
        <Box display="flex" flexDirection="column" width="45%">
          <Typography variant="h1">
            Welcome To WBC`S <br /> Watch Parties
          </Typography>
          <Typography className={classes.text} marginY={2}>
            Watch Parties let people come together online to watch their favorite sports. You as a guest, will be
            interacting with avid fans of boxing to answer their questions, talk about yourself or just joke around!
          </Typography>
          <Link className={classes.link} to="/login?spg=1">
            <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
              Sign In
            </CustomButton>
          </Link>
        </Box>
      ) : (
        currentEpisode && <div>On Boarding here!</div>
      )}
    </Box>
  )
}

export default VipJoinPage
