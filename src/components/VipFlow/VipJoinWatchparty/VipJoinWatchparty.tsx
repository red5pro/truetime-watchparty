import * as React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { Conference } from '../../../models/Conference'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { isMobileScreen, IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipJoinWatchparty.module'
import { Participant } from '../../../models/Participant'
import JoinContext from '../../JoinContext/JoinContext'
import { Episode } from '../../../models/Episode'
import LogoutIcon from '@mui/icons-material/Logout'
import WatchpartyParticipants from '../WatchpartyParticipants/WatchpartyParticipants'
import { CONFERENCE_API_CALLS } from '../../../services/api/conference-api-calls'
import { ConnectionRequest } from '../../../models/ConferenceStatusEvent'
import WatchContext from '../../WatchContext/WatchContext'
import { UserAccount } from '../../../models/UserAccount'
import Publisher from '../../Publisher/Publisher'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import { FatalError } from '../../../models/FatalError'
import ErrorModal from '../../Modal/ErrorModal'
import MediaContext from '../../MediaContext/MediaContext'
import WbcLogoSmall from '../../../assets/logos/WbcLogoSmall'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

interface PublisherRef {
  toggleCamera(on: boolean): any
  toggleMicrophone(on: boolean): any
}

interface IVipSeeParticipantsProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials
  currentEpisode?: Episode
  getNextConference: () => boolean
  currentConference?: Conference
  nextConferenceToJoin?: Conference
  userAccount?: UserAccount
  onCancelOnboarding(): any
}

const VipJoinWatchparty = (props: IVipSeeParticipantsProps) => {
  const {
    onActions,
    account,
    userAccount,
    currentConference,
    currentEpisode,
    getNextConference,
    nextConferenceToJoin,
    onCancelOnboarding,
  } = props

  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()
  const [joinConference, setJoinConference] = React.useState<boolean>(false)
  const [showDisclaimer, setShowDisclaimer] = React.useState<boolean>(true)
  const [showMediaStream, setShowMediaStream] = React.useState<boolean>(false)

  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const { classes } = useStyles()

  const vipRef = React.useRef<PublisherRef>(null)

  const joinContext = useJoinContext()
  const { join, leave, data } = useWatchContext()
  const { mediaStream } = useMediaContext()

  const isMobile = isMobileScreen()

  // TODO: THIS CAN GO INTO A UTILS
  const getSocketUrl = (token: string, name: string, guid: string) => {
    // TODO: Determine if Participant or Registered User?
    // TODO: Where does username & password come from if registered?

    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
      username: account?.email,
      password: account?.password,
    } as ConnectionRequest

    // Participant
    const fp = joinContext.fingerprint
    request.fingerprint = fp

    // Registered User
    // set u/p

    // Local testing
    const url = `ws://localhost:8001`
    return { url, request }
  }

  // React.useEffect(() => {
  //   const streamGuid = joinContext.getStreamGuid()
  //   const { url, request } = getSocketUrl(joinContext.joinToken, userAccount?.username ?? '', streamGuid)
  //   join(url, request)
  // }, [])

  React.useEffect(() => {
    if (data?.conference?.participants?.length) {
      setParticipants(data.conference.participants)
    }
  }, [data?.conference?.participants])

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
        }
      }
    }

    if (currentConference) {
      getCurrentConference()
    }
  }, [currentConference])

  const skipNextConference = () => {
    setJoinConference(false)
    const canJoinNextConference = getNextConference()

    if (canJoinNextConference) {
      onActions.onBackStep()
    } else {
      alert('there are no more conferences!')
    }
  }

  // if (joinConference && conferenceDetails && currentEpisode) {
  //   return (
  //     <VipMainStage
  //       currentEpisode={currentEpisode}
  //       conferenceDetails={conferenceDetails}
  //       participants={participants}
  //       skipNextConference={skipNextConference}
  //     />
  //   )
  // }

  const onDisclaimerClose = () => {
    setShowDisclaimer(false)
    setShowMediaStream(true)
    onCancelOnboarding()
  }

  const onPublisherBroadcastInterrupt = () => {
    setFatalError({
      status: 400,
      title: 'Broadcast Stream Error',
      statusText: `Your broadcast session was interrupted expectedly. You are no longer streaming.`,
      closeLabel: 'Restart',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  const onPublisherFail = () => {
    setFatalError({
      status: 404,
      title: 'Broadcast Stream Error',
      statusText: `Could not start a broadcast.`,
      closeLabel: 'Retry',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  const onPublisherBroadcast = () => {
    // TODO
  }

  const onLeave = () => {
    // TODO: Redirect to /bye/${joinToken}
    location.reload()
  }

  return (
    <Box height="100%" width="100%">
      <Stack direction="row" justifyContent="flex-end" sx={{ padding: '20px' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" className={classes.header}>
          <WbcLogoSmall />
          <Divider orientation="vertical" flexItem className={classes.headerDivider} />
          <Typography className={classes.headerTitle}>{currentEpisode?.displayName}</Typography>
        </Stack>
        <CustomButton
          size={BUTTONSIZE.SMALL}
          buttonType={BUTTONTYPE.LEAVE}
          startIcon={<LogoutIcon />}
          onClick={onLeave}
        >
          Leave
        </CustomButton>
      </Stack>
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="flex-end"
        alignItems="end"
        sx={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
        }}
      >
        {showDisclaimer && (
          <Box display="flex" justifyContent="center" flexDirection="column" className={classes.container}>
            <Typography>You can join this party or skip into another one</Typography>
            <Box marginTop={2}>
              <CustomButton onClick={onDisclaimerClose} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
                Got it!
              </CustomButton>
            </Box>
          </Box>
        )}
        <WatchpartyParticipants
          disabled={!showMediaStream}
          conferenceDetails={conferenceDetails}
          participants={participants}
          skipNextConference={skipNextConference}
          // nextConferenceToJoin={nextConferenceToJoin}
          onJoinNextParty={() => setShowMediaStream(true)}
        />
      </Box>
      {/* VIP Broadcast */}
      {showMediaStream && mediaStream && (
        <Box className={classes.vipContainer}>
          <Publisher
            key="publisher"
            ref={vipRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={joinContext.getStreamGuid()}
            stream={mediaStream}
            styles={{
              borderRadius: '20px',
              backgroundColor: 'black',
              width: '100%',
              height: '100%',
            }}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          />
        </Box>
      )}
      {/* Fatal Error */}
      {fatalError && (
        <ErrorModal
          open={!!fatalError}
          title={fatalError.title || 'Error'}
          message={fatalError.statusText}
          closeLabel={fatalError.closeLabel || 'OK'}
          onClose={fatalError.onClose}
        ></ErrorModal>
      )}
    </Box>
  )
}

export default VipJoinWatchparty
