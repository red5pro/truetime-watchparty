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
import { Participant } from '../../../models/Participant'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './WatchpartyParticipants.module'
import { ConferenceDetails } from '../../../models/ConferenceDetails'

interface IWatchpartyParticipantsProps {
  disabled: boolean
  conferenceDetails?: ConferenceDetails
  participants: Participant[]
  skipNextConference: () => void
  buttonPrimary?: boolean
  showNextConference?: boolean
  onJoinNextParty(): Promise<any>
}

const WatchpartyParticipants = (props: IWatchpartyParticipantsProps) => {
  const {
    disabled,
    conferenceDetails,
    participants,
    skipNextConference,
    onJoinNextParty,
    showNextConference = false,
  } = props

  const { classes } = useStyles()

  if (!conferenceDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginLeft={2}
        className={classes.container}
      >
        <Typography>There are no more conferences.</Typography>
        <CustomButton
          labelStyle={classes.enabledButton}
          onClick={() => skipNextConference()}
          size={BUTTONSIZE.MEDIUM}
          buttonType={disabled ? BUTTONTYPE.TERTIARY : BUTTONTYPE.SECONDARY}
        >
          {'Get Next Conference'}
        </CustomButton>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      marginLeft={2}
      className={classes.container}
    >
      <Typography className={classes.title}>{conferenceDetails?.displayName}</Typography>
      <Typography>{`${participants?.length} Attendee(s)`}</Typography>
      {/* Participants moved to Stage */}
      {/* <Box>
        {participants && (
          <Grid container spacing={2} marginY={2}>
            {participants.map((participant: Participant, i: number) => {
              return (
                <Grid key={`${participant.participantId}-${i}`} item xs={3}>
                  <Box>{participant.displayName}</Box>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box> */}
      <Box display="flex" justifyContent="space-evenly" className={classes.buttonContainer}>
        <CustomButton
          labelStyle={disabled ? classes.disabledButton : classes.enabledButton}
          disabled={disabled}
          onClick={() => onJoinNextParty()}
          size={BUTTONSIZE.SMALL}
          buttonType={disabled ? BUTTONTYPE.TERTIARY : BUTTONTYPE.SECONDARY}
        >
          {showNextConference ? 'Join Next Party' : 'Join The Party'}
        </CustomButton>
        <CustomButton
          labelStyle={disabled ? classes.disabledButton : classes.enabledButton}
          disabled={disabled}
          onClick={skipNextConference}
          size={BUTTONSIZE.SMALL}
          buttonType={BUTTONTYPE.TERTIARY}
        >
          Skip
        </CustomButton>
      </Box>
    </Box>
  )
}

export default WatchpartyParticipants
