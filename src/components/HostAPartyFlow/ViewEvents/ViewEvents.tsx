import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import useStyles from './ViewEvents.module'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import ElementList from '../../Common/ElementList/ElementList'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { getStartTimeFromTimestamp, IStepActionsSubComponent } from '../../../utils/commonUtils'
import EventContext from '../../EventContext/EventContext'
import Loading from '../../Loading/Loading'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'

const useEventContext = () => React.useContext(EventContext.Context)

interface IViewEventsProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials | null
}

const ViewEvents = (props: IViewEventsProps) => {
  const { onActions, account } = props

  const { loading, error, eventData } = useEventContext()

  const navigate = useNavigate()

  const { classes } = useStyles()
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }

  React.useEffect(() => {
    if (eventData.loaded) {
      console.log('TIME', eventData.currentEpisode, getStartTimeFromTimestamp(eventData.currentEpisode?.startTime))
    }
  }, [eventData])

  const onCreateAParty = () => {
    onActions.onNextStep()
  }

  const onJoinAParty = () => {
    navigate(`/join`)
  }

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box
      className={classes.root}
      sx={{
        backgroundImage: !error ? `url(${require('../../../assets/images/BoxMainImage.png')})` : '',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '40% 100%',
      }}
    >
      {loading && (
        <Box className={classes.container} display="flex" alignItems="center">
          <Loading text="Loading Event Data..." />
        </Box>
      )}
      {error && typeof error !== 'string' && (
        <SimpleAlertDialog
          title="Could not load event information"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Retry"
          onConfirm={onRetryRequest}
        />
      )}
      {error && typeof error === 'string' && (
        <Box className={classes.container} display="flex" alignItems="center">
          <Box className={classes.leftContainer}>
            <Typography variant="h3">{error}</Typography>
          </Box>
        </Box>
      )}
      {!loading && eventData.loaded && (
        <Box className={classes.container} display="flex" alignItems="center">
          <Box className={classes.leftContainer}>
            <Typography sx={{ fontSize: '24px' }}>{eventData.currentSeries?.displayName}</Typography>
            <Typography variant="h2">{eventData.currentEpisode?.displayName}</Typography>
            <Typography variant="h4" marginTop={3} sx={{ fontSize: '17px', fontWeight: 600 }}>
              {getStartTimeFromTimestamp(eventData.currentEpisode?.startTime)}
            </Typography>
            <Box display="flex" marginY={4} className={classes.buttonContainer}>
              <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY} onClick={onCreateAParty}>
                Create a WatchParty
              </CustomButton>
              <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.TERTIARY} onClick={onJoinAParty}>
                Join a WatchParty
              </CustomButton>
            </Box>
            {!account && (
              <Box display="flex">
                <Typography sx={{ fontSize: '14px' }} mr={2}>
                  Already have a party?
                </Typography>
                <Link to="login" className={classes.link}>
                  Sign in
                </Link>
              </Box>
            )}
            <Typography marginTop={4} sx={{ fontSize: '24px', fontWeight: '500' }}>
              What is a Watch Party?
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Watch your favorite matches with friends!
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: '400' }}>
              Invite your friends to come together online to enjoy your favorite sports!{' '}
            </Typography>
          </Box>
          {eventData.nextEpisodes?.length > 0 && (
            <Box className={classes.rightContainer}>
              <Typography sx={{ fontWeight: 600, textAlign: 'left' }} marginBottom={2}>
                Other events in this tournament
              </Typography>
              <ElementList items={eventData.nextEpisodes} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ViewEvents
