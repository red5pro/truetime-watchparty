import * as React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Participant } from '../../../models/Participant'
import MainStageSubscriber from '../../MainStageSubscriber/MainStageSubscriber'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles, { styles } from './WatchpartyParticipants.module'
import { ConferenceDetails } from '../../../models/ConferenceDetails'

interface IWatchpartyParticipantsProps {
  conferenceDetails?: ConferenceDetails
  participants: Participant[]
  skipCurrentConference: () => void
  buttonPrimary?: boolean
  onJoinNextParty: any
}

const WatchpartyParticipants = (props: IWatchpartyParticipantsProps) => {
  const { conferenceDetails, participants, skipCurrentConference, onJoinNextParty, buttonPrimary = false } = props

  const { classes } = useStyles()

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
      <Typography>{`${participants.length} Attendees`}</Typography>
      <Box>
        {participants && (
          <Grid container spacing={2} marginY={2}>
            {participants.map((participant: Participant) => {
              return (
                <Grid key={participant.participantId} item xs={3}>
                  <MainStageSubscriber
                    key={participant.participantId}
                    participant={participant}
                    styles={styles.stage.participantVideoFeedContainer}
                    videoStyles={styles.stage.participantVideoFeed}
                    host={STREAM_HOST}
                    useStreamManager={USE_STREAM_MANAGER}
                  />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
      <Box display="flex" justifyContent="space-evenly" className={classes.buttonContainer}>
        <CustomButton
          onClick={onJoinNextParty}
          size={BUTTONSIZE.SMALL}
          buttonType={buttonPrimary ? BUTTONTYPE.SECONDARY : BUTTONTYPE.TERTIARY}
        >
          Join The Party
        </CustomButton>
        <CustomButton onClick={skipCurrentConference} size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.TERTIARY}>
          Skip
        </CustomButton>
      </Box>
    </Box>
  )
}

export default WatchpartyParticipants
