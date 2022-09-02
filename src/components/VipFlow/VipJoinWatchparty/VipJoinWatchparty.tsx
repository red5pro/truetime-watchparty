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
import { API_SOCKET_HOST, STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import { FatalError } from '../../../models/FatalError'
import ErrorModal from '../../Modal/ErrorModal'
import MediaContext from '../../MediaContext/MediaContext'
import WbcLogoSmall from '../../../assets/logos/WbcLogoSmall'
import LeaveMessage from './LeaveMessage/LeaveMessage'
import VipTimer from '../VipTimer/VipTimer'
import VolumeControl from '../../VolumeControl/VolumeControl'
import Loading from '../../Loading/Loading'
import MainStageSubscriber from '../../MainStageSubscriber/MainStageSubscriber'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

const VIDEO_VOLUME = 10

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
  onMainVideoVolume(value: number): any
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
    onMainVideoVolume,
  } = props

  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()
  const [joinConference, setJoinConference] = React.useState<boolean>(false)
  const [showDisclaimer, setShowDisclaimer] = React.useState<boolean>(true)
  const [showMediaStream, setShowMediaStream] = React.useState<boolean>(false)
  const [vipBroadcastAvailable, setVipBroadcastAvailable] = React.useState<boolean>(false)
  const [finishedCountdown, setFinishedCountdown] = React.useState<boolean>(false)
  const [startedCountdown, setStartedCountdown] = React.useState<boolean>(false)

  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const { classes } = useStyles()

  const vipRef = React.useRef<PublisherRef>(null)

  const joinContext = useJoinContext()

  const { loading, error, join, leave, data } = useWatchContext()
  const { mediaStream } = useMediaContext()

  const isMobile = isMobileScreen()

  const getSocketUrl = (token: string, guid: string) => {
    // TODO: How to get display name of VIP?
    const request: ConnectionRequest = {
      displayName: 'VIP Guest',
      joinToken: token,
      streamGuid: guid,
      fingerprint: joinContext.fingerprint,
      username: account?.email,
      password: account?.password,
    } as ConnectionRequest

    return { url: API_SOCKET_HOST, request }
  }

  React.useEffect(() => {
    console.log('PARTIC', participants)
  }, [participants])

  React.useEffect(() => {
    // Fatal Socket Error.
    if (error) {
      setFatalError({
        ...(error as any),
        title: 'Connection Error',
        closeLabel: 'CLOSE',
        onClose: () => {
          setFatalError(undefined)
        },
      } as FatalError)
    }
  }, [error])

  React.useEffect(() => {
    const getCurrentConference = async () => {
      if (currentConference?.conferenceId && account) {
        // REMOVE THIS WHEN /vipnext ENDPOINT IS READY
        const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(currentConference?.conferenceId, account)
        const currConf = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

        const { data } = currConf
        if (data && confDetails.data) {
          setConferenceDetails(confDetails.data)
          setParticipants(data.participants)
          joinContext.setConferenceData(confDetails.data)
          joinContext.setJoinToken(confDetails.data.joinToken)
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

  React.useEffect(() => {
    if (showMediaStream && mediaStream) {
      onVolumeChange(VIDEO_VOLUME)
    }
  }, [showMediaStream, mediaStream])

  // TODO: Call this each time they decide to join a conference/party
  const onJoinNextParty = (details: ConferenceDetails) => {
    const streamGuid = joinContext.getStreamGuid()
    const { url, request } = getSocketUrl(details.joinToken, streamGuid)
    setStartedCountdown(true)
    join(url, request)
  }

  // Lets start streaming and pulling in conferences...
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
    // Nothing. this is just a notification that they have a stream going.
    // This will likely be invoked before they join a party.
    setVipBroadcastAvailable(true)
  }

  const onLeave = () => {
    // TODO: Redirect to /bye/${joinToken}
    // TODO: Probably a nicer by for VIP?
    location.reload()
  }

  const onVolumeChange = (value: number) => {
    if (showMediaStream && mediaStream) {
      onMainVideoVolume(value / 100)
    }
  }

  return (
    <Box height="100%" width="100%">
      <Stack direction="row" justifyContent="flex-end" sx={{ padding: '20px' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" className={classes.header}>
          <WbcLogoSmall />
          <Divider orientation="vertical" flexItem className={classes.headerDivider} />
          <Typography className={classes.headerTitle}>{currentEpisode?.displayName}</Typography>
        </Stack>
        <VolumeControl
          isOpen={false}
          min={0}
          max={100}
          step={1}
          position="horizontal"
          currentValue={VIDEO_VOLUME}
          onVolumeChange={onVolumeChange}
        />
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
        {/* CHECK WHEN WE SHOULD DISPLAY THIS */}
        {finishedCountdown ? (
          <LeaveMessage />
        ) : (
          <>
            {!showDisclaimer && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: -60,
                }}
              >
                <VipTimer
                  startedCountdown={startedCountdown}
                  setFinishedCountdown={setFinishedCountdown}
                  finishedCountdown={finishedCountdown}
                />
              </Box>
            )}
            <WatchpartyParticipants
              disabled={!showMediaStream}
              conferenceDetails={conferenceDetails}
              participants={participants}
              skipNextConference={skipNextConference}
              // nextConferenceToJoin={nextConferenceToJoin}
              onJoinNextParty={onJoinNextParty}
            />
          </>
        )}
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
      {/* Other Participants Video Playback */}
      {participants && vipBroadcastAvailable && (
        <Box className={classes.subscriberList}>
          <Box className={classes.subscriberContainer}>
            {participants.map((s: Participant, i: number) => {
              return (
                <MainStageSubscriber
                  key={`${s.participantId}_${i}`}
                  participant={s}
                  styles={{
                    maxHeight: '124px',
                    flexGrow: 1,
                    height: '100%',
                  }}
                  videoStyles={{
                    borderRadius: '20px',
                    backgroundColor: 'black',
                    width: '100%',
                  }}
                  host={STREAM_HOST}
                  useStreamManager={USE_STREAM_MANAGER}
                />
              )
            })}
          </Box>
        </Box>
      )}
      {/* Interim loading of party participants while setting up broadcast */}
      {participants && showMediaStream && !vipBroadcastAvailable && (
        <Box className={classes.participantsLoading}>
          <Loading text={`Loading participants of ${conferenceDetails?.displayName}...`} />
        </Box>
      )}
      {loading && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading text={`Loading ${conferenceDetails?.displayName}...`} />
        </Stack>
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
