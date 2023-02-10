import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import JoinContext from '../../components/JoinContext/JoinContext'
import Loading from '../../components/Common/Loading/Loading'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import { getStartTimeFromTimestamp, Paths } from '../../utils/commonUtils'
import useStyles from './ThankYouPage.module'
import { isWatchParty } from '../../settings/variables'

const useJoinContext = () => React.useContext(JoinContext.Context)

// TODO: Determine how we are taken here between simple `Leave` and when conference is ended.
const ThankYouPage = () => {
  const { loading, error, joinToken, conferenceData, seriesEpisode } = useJoinContext()

  const { classes } = useStyles()

  const navigate = useNavigate()
  const path = useLocation().pathname

  const onRejoin = () => {
    if (path.match(Paths.ANONYMOUS_THANKYOU)) {
      navigate(`${Paths.ANONYMOUS}/${joinToken}`)
      return
    }
    navigate(`/join/${joinToken}`)
  }

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box className={classes.root}>
      {isWatchParty && (
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
      )}
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
              {`Rejoin ${isWatchParty ? 'Party' : ''}`}
            </CustomButton>
            {isWatchParty && (
              <Stack spacing={2} direction="column">
                <Typography sx={{ fontSize: '12px' }}>Brought to you by...</Typography>
                <Stack spacing={2} direction="row">
                  {/* <OracleLogo /> */}
                  <Box sx={{ width: 'auto', height: '70px' }}>
                    <img
                      height="70px"
                      alt="Logo Placeholder"
                      src={require('../../assets/logos/sponsor-placeholder-2-logo.png')}
                    ></img>
                  </Box>
                </Stack>
              </Stack>
            )}
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
      {isWatchParty && (
        <Box sx={{ width: '50%', position: 'absolute', right: 0, bottom: '20%' }}>
          <img
            alt="Thank you Page Main Image"
            src={require('../../assets/images/BoxingSession.png')}
            style={{ maxWidth: '70%' }}
          ></img>
        </Box>
      )}
    </Box>
  )
}

export default ThankYouPage
