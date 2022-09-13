import * as React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { isMobileScreen, UserRoles } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipJoinWatchparty.module'
import { Participant } from '../../../models/Participant'
import { Episode } from '../../../models/Episode'
import LogoutIcon from '@mui/icons-material/Logout'
import WatchpartyParticipants from '../WatchpartyParticipants/WatchpartyParticipants'
import { ConnectionRequest } from '../../../models/ConferenceStatusEvent'
import WatchContext from '../../WatchContext/WatchContext'
import Publisher from '../../Publisher/Publisher'
import { API_SOCKET_HOST, STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import { FatalError } from '../../../models/FatalError'
import ErrorModal from '../../Modal/ErrorModal'
import MediaContext from '../../MediaContext/MediaContext'
import WbcLogoSmall from '../../../assets/logos/WbcLogoSmall'
import LeaveMessage from './LeaveMessage/LeaveMessage'
import VipTimer from '../VipTimer/VipTimer'
import VolumeControl from '../../VolumeControl/VolumeControl'
import Loading from '../../Common/Loading/Loading'
import MainStageSubscriber from '../../MainStageSubscriber/MainStageSubscriber'
import VipJoinContext from '../../VipJoinContext/VipJoinContext'
import useCookies from '../../../hooks/useCookies'

const useJoinContext = () => React.useContext(VipJoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

const VIDEO_VOLUME = 10

interface PublisherRef {
  toggleCamera(on: boolean): any
  toggleMicrophone(on: boolean): any
}

interface IVipSeeParticipantsProps {
  currentEpisode?: Episode
  onCancelOnboarding(): any
  onMainVideoVolume(value: number): any
}

const VipJoinWatchparty = (props: IVipSeeParticipantsProps) => {
  const { currentEpisode, onCancelOnboarding, onMainVideoVolume } = props
  const [showNextConference, setShowNextConference] = React.useState<boolean>(false)
  const [showDisclaimer, setShowDisclaimer] = React.useState<boolean>(true)
  const [showMediaStream, setShowMediaStream] = React.useState<boolean>(false)
  const [vipBroadcastAvailable, setVipBroadcastAvailable] = React.useState<boolean>(false)
  const [finishedCountdown, setFinishedCountdown] = React.useState<boolean>(false)
  const [startedCountdown, setStartedCountdown] = React.useState<boolean>(false)
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])
  const {
    currentConferenceData,
    nextVipConferenceDetails,
    setCurrentConferenceGetNext,
    getNextConference,
    fingerprint,
    getStreamGuid,
  } = useJoinContext()
  const { loading, error, join, leave, data } = useWatchContext()
  const { mediaStream } = useMediaContext()

  const isMobile = isMobileScreen()

  const vipRef = React.useRef<PublisherRef>(null)

  console.log({ nextVipConferenceDetails })

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
    if (showMediaStream && mediaStream) {
      onVolumeChange(VIDEO_VOLUME)
    }
  }, [showMediaStream, mediaStream])

  const joinNextConference = async () => {
    await setCurrentConferenceGetNext()
    setShowNextConference(true)
  }

  const skipOrGetNextConference = async () => {
    const nextConference = await getNextConference(false)
    setShowNextConference(nextConference)
  }

  const getSocketUrl = (token: string, guid: string) => {
    // TODO: How to get display name of VIP?
    const cookies = getCookies()
    const { account } = cookies
    const request: ConnectionRequest = {
      displayName: 'VIP Guest',
      joinToken: token,
      streamGuid: guid,
      fingerprint: fingerprint,
      messageType: 'JoinConferenceRequest',
      username: account?.email,
      password: account?.password,
    } as ConnectionRequest

    return { url: API_SOCKET_HOST, request }
  }

  const onJoinNextParty = async () => {
    if (nextVipConferenceDetails) {
      leave()
      const streamGuid = getStreamGuid()
      const { url, request } = getSocketUrl(nextVipConferenceDetails.joinToken, streamGuid)
      setStartedCountdown(true)
      join(url, request)
      joinNextConference()
    }
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
          <LeaveMessage canStayLonger={true} />
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
                  setStartedCountdown={setStartedCountdown}
                />
              </Box>
            )}

            <WatchpartyParticipants
              disabled={!showMediaStream}
              conferenceDetails={nextVipConferenceDetails}
              participants={
                nextVipConferenceDetails?.participants.filter((p: Participant) => p.role !== UserRoles.VIP) ?? []
              }
              skipNextConference={skipOrGetNextConference}
              showNextConference={showNextConference}
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
            streamGuid={getStreamGuid()}
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

      {data?.list && vipBroadcastAvailable && (
        <Box className={classes.subscriberList}>
          <Box className={classes.subscriberContainer}>
            {data?.list.map((participant: Participant, i: number) => {
              return (
                <MainStageSubscriber
                  key={`${participant.participantId}_${i}`}
                  participant={participant}
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
      {currentConferenceData?.participants && showMediaStream && !vipBroadcastAvailable && (
        <Box className={classes.participantsLoading}>
          <Loading text={`Loading participants of ${currentConferenceData?.displayName}...`} />
        </Box>
      )}
      {loading && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading text={`Loading ${currentConferenceData?.displayName}...`} />
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
