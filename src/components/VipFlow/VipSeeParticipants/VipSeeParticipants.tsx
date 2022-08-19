import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { IAccount } from '../../../models/Account'
import { Conference } from '../../../models/Conference'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { Episode } from '../../../models/Episode'
import { getConferenceDetails, getConferenceParticipants } from '../../../services/conference/conference'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipSeeParticipants.module'

interface IVipSeeParticipantsProps {
  onActions: IStepActionsSubComponent
  currentConference?: Conference
  account?: IAccount
  joinNextConference: () => boolean
}

const VipSeeParticipants = (props: IVipSeeParticipantsProps) => {
  const { onActions, currentConference, account, joinNextConference } = props

  const [participants, setParticipants] = React.useState<any>([])
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()

  const { classes } = useStyles()

  React.useEffect(() => {
    if (currentConference) {
      getCurrentConference()
      getParticipants()
    }
  }, [currentConference])

  const getCurrentConference = async () => {
    if (currentConference?.conferenceId && account) {
      const currConf = await getConferenceDetails(currentConference?.conferenceId, account)

      if (currConf.data) {
        setConferenceDetails(currConf.data)
      }
    }
  }

  const getParticipants = async () => {
    if (currentConference?.conferenceId && account) {
      const response = await getConferenceParticipants(currentConference?.conferenceId, account)

      if (response.data?.participants && response.status === 200) {
        setParticipants(response.data?.participants)
      }
    }
  }

  const skipCurrentConference = () => {
    const canJoinNextConference = joinNextConference()

    if (canJoinNextConference) {
      onActions.onBackStep()
    } else {
      onActions.onNextStep()
    }
  }

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="end" height="100%" marginBottom={8}>
      <Box display="flex" flexDirection="column" justifyContent="center" className={classes.container}>
        <Typography>You can join this party or skip into another one</Typography>

        <Box marginTop={2}>
          <CustomButton onClick={onActions.onNextStep} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
            Got it!
          </CustomButton>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginLeft={2}
        className={classes.container}
      >
        <Typography className={classes.title}>{conferenceDetails?.displayName}</Typography>
        <Typography>{`${participants.length} Attendees`}</Typography>
        <Box display="flex" justifyContent="space-evenly">
          <CustomButton size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.TERTIARY}>
            Join The Party
          </CustomButton>
          <CustomButton onClick={skipCurrentConference} size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.TERTIARY}>
            Skip
          </CustomButton>
        </Box>
      </Box>
    </Box>
  )
}

export default VipSeeParticipants
