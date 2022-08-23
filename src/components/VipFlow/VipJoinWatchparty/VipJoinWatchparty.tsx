import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { IAccount } from '../../../models/Account'
import { Conference } from '../../../models/Conference'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { getConferenceDetails, getConferenceParticipants } from '../../../services/conference/conference'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipJoinWatchparty.module'
import { Participant } from '../../../models/Participant'
import JoinContext from '../../JoinContext/JoinContext'
import JoinSectionAVSetup from '../../JoinSections/JoinSectionAVSetup'
import { Episode } from '../../../models/Episode'
import VipMainStage from '../VipMainStage/VipMainStage'
import WatchpartyParticipants from '../WatchpartyParticipants/WatchpartyParticipants'

const useJoinContext = () => React.useContext(JoinContext.Context)

interface IVipSeeParticipantsProps {
  onActions: IStepActionsSubComponent
  currentConference?: Conference
  account?: IAccount
  currentEpisode?: Episode
  joinNextConference: () => boolean
}

const VipJoinWatchparty = (props: IVipSeeParticipantsProps) => {
  const { onActions, currentConference, account, currentEpisode, joinNextConference } = props

  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()
  const [joinConference, setJoinConference] = React.useState<boolean>(false)
  const [showDisclaimer, setShowDisclaimer] = React.useState<boolean>(true)
  const [showMediaStream, setShowMediaStream] = React.useState<boolean>(false)

  const { classes } = useStyles()
  const { setJoinToken } = useJoinContext()

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
        setJoinToken(currConf.data.joinToken)
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
        setShowMediaStream={setShowMediaStream}
      />
    )
  }

  if (showMediaStream) {
    return (
      <Box className={classes.avSetup}>
        <JoinSectionAVSetup onJoin={() => setJoinConference(true)} shouldDisplayBackButton={false} />
        {/* <MediaSetup selfCleanup={false} /> */}
      </Box>
    )
  }

  return (
    <Box padding={4} height="100%" width="100%">
      <Box display="flex" justifyContent="flex-end" alignItems="end" height="100%" marginBottom={4}>
        {showDisclaimer && (
          <Box display="flex" justifyContent="center" className={classes.container}>
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
          setShowMediaStream={setShowMediaStream}
        />
      </Box>
    </Box>
  )
}

export default VipJoinWatchparty
