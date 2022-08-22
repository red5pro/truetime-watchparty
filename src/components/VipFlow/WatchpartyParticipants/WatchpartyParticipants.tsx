import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { Participant } from '../../../models/Participant'
import MainStageSubscriber from '../../MainStageSubscriber/MainStageSubscriber'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './WatchpartyParticipants.module'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import WatchContext from '../../WatchContext/WatchContext'

interface IWatchpartyParticipantsProps {
  conferenceDetails?: ConferenceDetails
  participants: Participant[]
  skipCurrentConference: () => void
  setShowMediaStream: (value: boolean) => void
  buttonPrimary?: boolean
}

const WatchpartyParticipants = (props: IWatchpartyParticipantsProps) => {
  const { conferenceDetails, participants, skipCurrentConference, setShowMediaStream, buttonPrimary = false } = props

  const useWatchContext = React.useContext(WatchContext.Context)

  const { classes } = useStyles()
  const { data } = useWatchContext

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
        {/* THIS SHOULD RENDER PARTICIPANTS FEED */}
        {data.list && (
          <Box>
            <Box>
              {data.list.map((participant: Participant) => {
                return (
                  <React.Fragment key={participant.participantId}>
                    <MainStageSubscriber
                      key={participant.participantId}
                      participant={participant}
                      styles={{}}
                      videoStyles={{}}
                      host={STREAM_HOST}
                      useStreamManager={USE_STREAM_MANAGER}
                    />
                  </React.Fragment>
                )
              })}
            </Box>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="space-evenly">
        <CustomButton
          onClick={() => setShowMediaStream(true)}
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
