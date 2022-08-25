import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { Conference } from '../../../models/Conference'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { isMobileScreen, IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipJoinWatchparty.module'
import { Participant } from '../../../models/Participant'
import JoinContext from '../../JoinContext/JoinContext'
import JoinSectionAVSetup from '../../JoinSections/JoinSectionAVSetup'
import { Episode } from '../../../models/Episode'
import VipMainStage from '../VipMainStage/VipMainStage'
import WatchpartyParticipants from '../WatchpartyParticipants/WatchpartyParticipants'
import { CONFERENCE_API_CALLS } from '../../../services/api/conference-api-calls'

interface IVipSeeParticipantsProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials
  currentEpisode?: Episode
  joinNextConference: () => boolean
  currentConference?: Conference
}

const VipJoinWatchparty = (props: IVipSeeParticipantsProps) => {
  const { onActions, account, currentConference, currentEpisode, joinNextConference } = props

  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()
  const [joinConference, setJoinConference] = React.useState<boolean>(false)
  const [showDisclaimer, setShowDisclaimer] = React.useState<boolean>(true)
  const [showMediaStream, setShowMediaStream] = React.useState<boolean>(false)

  const { classes } = useStyles()
  const joinContext = React.useContext(JoinContext.Context)

  const isMobile = isMobileScreen()

  React.useEffect(() => {
    const getCurrentConference = async () => {
      if (currentConference?.conferenceId && account) {
        // REMOVE THIS WHEN /vipnext ENDPOINT IS READY
        const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(currentConference?.conferenceId, account)
        const currConf = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

        if (currConf.data && confDetails.data) {
          setConferenceDetails(confDetails.data)
          joinContext.setConferenceData(confDetails.data)
          joinContext.setJoinToken(currConf.data.joinToken)
          setParticipants(currConf.data.participants)
          // setJoinToken(currConf.data.joinToken)
        }
      }
    }

    if (currentConference) {
      getCurrentConference()
    }
  }, [currentConference])

  const skipCurrentConference = () => {
    setJoinConference(false)
    const canJoinNextConference = joinNextConference()

    if (canJoinNextConference) {
      onActions.onBackStep()
    } else {
      alert('there are no more conferences!')
    }
  }

  if (joinConference && conferenceDetails && currentEpisode) {
    return (
      <VipMainStage
        currentEpisode={currentEpisode}
        conferenceDetails={conferenceDetails}
        participants={participants}
        skipCurrentConference={skipCurrentConference}
      />
    )
  }

  if (showMediaStream) {
    return (
      <Box className={classes.avSetup}>
        <JoinSectionAVSetup onJoin={() => setJoinConference(true)} shouldDisplayBackButton={false} />
      </Box>
    )
  }

  return (
    <Box padding={4} height="100%" width="100%">
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="flex-end"
        alignItems="end"
        height="100%"
        marginBottom={4}
      >
        {showDisclaimer && (
          <Box display="flex" justifyContent="center" flexDirection="column" className={classes.container}>
            <Typography>You can join this party or skip into another one</Typography>
            <Box marginTop={2}>
              <CustomButton
                onClick={() => setShowDisclaimer(false)}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
              >
                Got it!
              </CustomButton>
            </Box>
          </Box>
        )}
        <WatchpartyParticipants
          conferenceDetails={conferenceDetails}
          participants={participants}
          skipCurrentConference={skipCurrentConference}
          onJoinNextParty={() => setShowMediaStream(true)}
        />
      </Box>
    </Box>
  )
}

export default VipJoinWatchparty
