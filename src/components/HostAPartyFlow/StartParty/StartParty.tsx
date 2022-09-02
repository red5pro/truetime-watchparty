import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { getStartTimeFromTimestamp, IStepActionsSubComponent } from '../../../utils/commonUtils'
import EventContext from '../../EventContext/EventContext'
import SetupPartyForm from './SetupPartyForm'
import useStyles from './StartParty.module'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import Loading from '../../Loading/Loading'

const useEventContext = () => React.useContext(EventContext.Context)

interface IStartPartyProps {
  onActions: IStepActionsSubComponent
  data?: ConferenceDetails
  setData: (values: ConferenceDetails, account: AccountCredentials | undefined) => boolean
  account: AccountCredentials
}

const StartParty = (props: IStartPartyProps) => {
  const { onActions, data, setData, account } = props

  const { classes } = useStyles()

  const { loading, error, eventData } = useEventContext()

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box className={classes.root}>
      <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
        Host a Watch Party
      </Typography>
      {loading && (
        <Box className={classes.container} display="flex" alignItems="center">
          <Loading text="Loading Event Data..." />
        </Box>
      )}
      {error && (
        <SimpleAlertDialog
          title="Could not load event information"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Retry"
          onConfirm={onRetryRequest}
        />
      )}
      {!loading && eventData.loaded && (
        <Box className={classes.container} display="flex" flexDirection="column">
          <Typography sx={{ fontSize: '24px' }}>{eventData.currentSeries?.displayName}</Typography>
          <Typography variant="h2">{eventData.currentEpisode?.displayName}</Typography>
          <Typography variant="h4" marginY={1} sx={{ fontSize: '18px', fontWeight: 600 }}>
            {getStartTimeFromTimestamp(eventData.currentEpisode?.startTime)}
          </Typography>

          <Box display="flex">
            <Typography marginRight={2}>Set up your party</Typography>

            {!account && (
              <Link to="login" className={classes.link}>
                Returning host?
              </Link>
            )}
          </Box>
          <SetupPartyForm onActions={onActions} data={data} setData={setData} account={account} />
        </Box>
      )}
      <img
        className={classes.image}
        alt="Start Party Main Image"
        src={require('../../../assets/images/BoxMainImage.png')}
      ></img>
    </Box>
  )
}

export default StartParty
