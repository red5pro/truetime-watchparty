import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import JoinContext from '../../components/JoinContext/JoinContext'
import Loading from '../../components/Loading/Loading'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'
import useStyles from './ThankYouPage.module'

const useJoinContext = () => React.useContext(JoinContext.Context)

const ThankYouPage = () => {
  const { loading, error, joinToken, conferenceData, seriesEpisode } = useJoinContext()

  const { classes } = useStyles()

  const navigate = useNavigate()

  const onRejoin = () => {
    navigate(`/join/${joinToken}`)
  }

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box className={classes.root}>
      <Box padding={2} className={classes.brandLogo}>
        <WbcLogoSmall />
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
          <Stack spacing={8}>
            <Typography marginTop={2} className={classes.thankyouMessage}>
              {conferenceData.thankYouMessage}
            </Typography>
            <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY} onClick={onRejoin}>
              Rejoin Party
            </CustomButton>
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
    </Box>
  )
}

export default ThankYouPage
