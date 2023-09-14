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
import { useNavigate } from 'react-router'
import { Button, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import InfoIcon from '@mui/icons-material/Info'

import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Participant } from '../../models/Participant'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'
import SignInModal from '../Modal/SignInModal'
import useCookies from '../../hooks/useCookies'

interface JoinLandingProps {
  joinToken: string
  seriesEpisode?: any
  conferenceData?: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onStartJoin(): any
}

const JoinSectionLanding = (props: JoinLandingProps) => {
  const { joinToken, seriesEpisode, conferenceData, conferenceParticipantsStringBuilder, onStartJoin } = props
  const [showLogin, setShowLogin] = React.useState<boolean>(false)

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])
  const navigate = useNavigate()

  const onHostLogin = () => {
    //    setShowLogin(true)
    navigate(`/login?r_id=join/${joinToken}`)
  }

  const hideLogin = (account?: any) => {
    setShowLogin(false)
    if (account && account.email && account.password) {
      onStartJoin()
    }
  }

  return (
    <Box className={classes.landingContainer}>
      {seriesEpisode && (
        <>
          <Typography sx={{ fontSize: '24px' }}>{seriesEpisode.series.displayName}</Typography>
          <Typography variant="h1">{seriesEpisode.episode.displayName}</Typography>
          <Box display="flex" alignItems="center" sx={{ marginTop: '24px' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
              {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
            </Typography>
            <Tooltip
              title={seriesEpisode.episode.description ?? 'Additional Information...'}
              arrow
              sx={{ marginLeft: '12px' }}
            >
              <InfoIcon fontSize="small" />
            </Tooltip>
          </Box>
        </>
      )}
      <Box className={classes.conferenceDetails}>
        {conferenceData && (
          <>
            <Typography sx={{ fontSize: '36px', fontWeight: 600 }}>{conferenceData.displayName}</Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
            <Typography paddingTop={2} sx={{ fontSize: '12px', fontWeight: 500 }}>
              {conferenceParticipantsStringBuilder(conferenceData.participants)}
            </Typography>
          </>
        )}
        <Box className={classes.joinControls}>
          <CustomButton
            className={classes.landingJoin}
            size={BUTTONSIZE.MEDIUM}
            buttonType={BUTTONTYPE.SECONDARY}
            onClick={onStartJoin}
          >
            Join Party
          </CustomButton>
          {!getCookies()?.account && (
            <Button variant="text" className={classes.link} onClick={onHostLogin}>
              Are you the host?
            </Button>
          )}
        </Box>
      </Box>
      <SignInModal open={showLogin} onDismiss={hideLogin} />
    </Box>
  )
}

export default JoinSectionLanding
