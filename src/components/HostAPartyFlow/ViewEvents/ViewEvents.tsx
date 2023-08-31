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
import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import useStyles from './ViewEvents.module'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import ElementList from '../../Common/ElementList/ElementList'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { getStartTimeFromTimestamp, IStepActionsSubComponent } from '../../../utils/commonUtils'
import EventContext from '../../EventContext/EventContext'
import Loading from '../../Common/Loading/Loading'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { isWatchParty } from '../../../settings/variables'

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
        backgroundImage: !error && isWatchParty ? "url('../../../assets/images/BoxMainImage.png')" : '',
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
                {`Create a ${isWatchParty ? 'Watch Party' : 'Webinar'}`}
              </CustomButton>
              <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.TERTIARY} onClick={onJoinAParty}>
                {`Join a ${isWatchParty ? 'Watch Party' : 'Webinar'}`}
              </CustomButton>
            </Box>
            {!account && (
              <Box display="flex">
                <Typography sx={{ fontSize: '14px' }} mr={2}>
                  Already have a party?
                </Typography>
                <Link to="login?r_id=home" className={classes.link}>
                  Sign in
                </Link>
              </Box>
            )}
            {isWatchParty && (
              <>
                <Typography marginTop={4} sx={{ fontSize: '24px', fontWeight: '500' }}>
                  What is a Watch Party?
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
                  Watch your favorite matches with friends!
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: '400' }}>
                  Invite your friends to come together online to enjoy your favorite sports!{' '}
                </Typography>
              </>
            )}
          </Box>
          {eventData.loaded && eventData.nextEpisodes?.length > 0 && (
            <Box className={classes.rightContainer}>
              <Typography sx={{ fontWeight: 600, textAlign: 'left' }} marginBottom={2}>
                Other events in this series
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
