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
import Loading from '../../Common/Loading/Loading'
import { isWatchParty } from '../../../settings/variables'
import { assetBasepath } from '../../../utils/pathUtils'

const useEventContext = () => React.useContext(EventContext.Context)

interface IStartPartyProps {
  onActions: IStepActionsSubComponent
  data?: ConferenceDetails
  setData: (values: ConferenceDetails) => boolean
  account?: AccountCredentials
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
        {`Host a ${isWatchParty ? 'Watch Party' : 'Webinar'}`}
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
            <Typography marginRight={2}>{isWatchParty ? 'Set up your party' : 'Set up this webinar'}</Typography>

            {!account && (
              <Link to="login" className={classes.link}>
                Returning host?
              </Link>
            )}
          </Box>
          <SetupPartyForm onActions={onActions} data={data} setData={setData} account={account} />
        </Box>
      )}
      {isWatchParty && (
        <img
          className={classes.image}
          alt="Start Party Main Image"
          src={`${assetBasepath}assets/images/BoxMainImage.png`}
        ></img>
      )}
    </Box>
  )
}

export default StartParty
