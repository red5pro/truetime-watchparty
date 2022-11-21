import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OracleLogo from '../../assets/logos/OracleLogo'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import Red5ProLogoSmall from '../../assets/logos/Red5ProLogoSmall'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import JoinContext from '../../components/JoinContext/JoinContext'
import Loading from '../../components/Common/Loading/Loading'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'
import useStyles from './ThankYouPage.module'

const vodReg = /^\/thankyou\/vod\//
const useJoinContext = () => React.useContext(JoinContext.Context)

// TODO: Determine how we are taken here between simple `Leave` and when conference is ended.
const ThankYouPage = () => {
  const { loading, error, joinToken, conferenceData, seriesEpisode } = useJoinContext()

  const { classes } = useStyles()
  const location = useLocation()

  const navigate = useNavigate()

  const onRejoin = () => {
    const { pathname } = location
    const isVOD = !!pathname.match(vodReg)
    if (isVOD) {
      navigate(`/join/vod/${joinToken}${location.search}`)
    } else {
      navigate(`/join/${joinToken}`)
    }
  }

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box className={classes.root}>
      <Box padding={2} className={classes.brandLogo}>
        <Red5ProLogoSmall />
      </Box>
      {loading && <Loading />}
      <Stack className={classes.container}>
        {!loading && seriesEpisode && (
          <Stack>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{seriesEpisode.episode.displayName}</Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
              {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
            </Typography>
          </Stack>
        )}
        {!loading && conferenceData && (
          <Stack spacing={4}>
            <Typography marginTop={2} className={classes.thankyouMessage}>
              {conferenceData.thankYouMessage}
            </Typography>
            {/* TODO: How to recognize that the conference has ended? */}
            <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY} onClick={onRejoin}>
              Rejoin Party
            </CustomButton>
            <Stack spacing={2} direction="column">
              <Typography sx={{ fontSize: '12px' }}>Powered by</Typography>
              <Stack spacing={2} direction="row">
                {/* <OracleLogo /> */}
                <Box sx={{ width: 'auto', height: '70px' }}>
                  <img
                    // height="70px"
                    style={{ maxWidth: '160px' }}
                    alt="Logo Placeholder"
                    src={require('../../assets/logos/Red5Pro_logo_white_red_v2.png')}
                  ></img>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
      {error && (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Retry"
          onConfirm={onRetryRequest}
        />
      )}
      <Box sx={{ width: '50%', position: 'absolute', right: 0, bottom: '20%' }}>
        <img
          alt="Thank you Page Main Image"
          src={require('../../assets/images/BoxingSession.png')}
          style={{ maxWidth: '70%' }}
        ></img>
      </Box>
    </Box>
  )
}

export default ThankYouPage
