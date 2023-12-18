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
import { assetBasepath } from '../../utils/pathUtils'

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
                      src={`${assetBasepath}assets/logos/sponsor-placeholder-2-logo.png`}
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
            src={`${assetBasepath}assets/images/BoxingSession.png`}
            style={{ maxWidth: '70%' }}
          ></img>
        </Box>
      )}
    </Box>
  )
}

export default ThankYouPage
