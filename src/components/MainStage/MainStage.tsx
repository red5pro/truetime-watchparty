import React from 'react'
import * as portals from 'react-reverse-portal'
import { useNavigate } from 'react-router-dom'
import { IconButton, Box, Button, Typography, Stack, Input } from '@mui/material'
import LogOutIcon from '@mui/icons-material/Logout'
import Lock from '@mui/icons-material/Lock'
import LockOpen from '@mui/icons-material/LockOpen'
import GroupAdd from '@mui/icons-material/GroupAdd'
import ChatBubble from '@mui/icons-material/ChatBubble'
import { ENABLE_MUTE_API, STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import Loading from '../Loading/Loading'
import Subscriber from '../Subscriber/Subscriber'

import useStyles from './MainStage.module'
import MediaContext from '../MediaContext/MediaContext'
import JoinContext from '../JoinContext/JoinContext'
import WatchContext from '../WatchContext/WatchContext'

import styles from './MainStageLayout'
import Publisher from '../Publisher/Publisher'
import { Participant } from '../../models/Participant'
import MainStageSubscriber from '../MainStageSubscriber/MainStageSubscriber'
import ShareLinkModal from '../Modal/ShareLinkModal'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { UserRoles } from '../../utils/commonUtils'
import VIPSubscriber from '../VIPSubscriber/VIPSubscriber'
import PublisherPortalStage from './PublisherPortalStage'
import PublisherPortalFullscreen from './PublisherPortalFullscreen'
import VolumeControl from '../VolumeControl/VolumeControl'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'
import { useCookies } from 'react-cookie'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

enum Layout {
  STAGE = 1,
  FULLSCREEN,
  EMPTY,
}

const layoutReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LAYOUT':
      return { ...state, layout: action.layout, style: action.style }
  }
}

interface SubscriberRef {
  setVolume(value: number): any
}

interface PublisherRef {
  toggleCamera(on: boolean): any
  toggleMicrophone(on: boolean): any
}

const MainStage = () => {
  const joinContext = useJoinContext()
  const { data, message, join } = useWatchContext()
  const mediaContext = useMediaContext()

  const { classes } = useStyles()
  const navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['account'])

  const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), [])

  const mainVideoRef = React.useRef<SubscriberRef>(null)
  const publisherRef = React.useRef<PublisherRef>(null)

  const [layout, dispatch] = React.useReducer(layoutReducer, { layout: Layout.STAGE, style: styles.stage })

  const [showLink, setShowLink] = React.useState<boolean>(false)
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT.toLowerCase())
  const [maxParticipants, setMaxParticipants] = React.useState<number>(0)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()
  const [availableVipParticipant, setAvailableVipParticipant] = React.useState<Participant | undefined>()
  const [requiresSubscriberScroll, setRequiresSubscriberScroll] = React.useState<boolean>(false)
  const [chatIsHidden, setChatIsHidden] = React.useState<boolean>(false)
  const [maxParticipantGridColumnStyle, setMaxParticipantGridColumnStyle] = React.useState<any>({
    gridTemplateColumns:
      'calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px)',
  })

  const getSocketUrl = (token: string, name: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
    } as ConnectionRequest

    const fp = joinContext.fingerprint
    request.fingerprint = fp
    if (cookies?.account) {
      // Registered User
      const { email, password } = cookies.account
      request.username = email
      request.password = password
    }

    // Local testing
    const url = `ws://localhost:8001`
    return { url, request }
  }

  if (!mediaContext?.mediaStream) {
    // TODO: Navigate back to auth?
    // TODO: If have auth context, navigate back to join?
    // navigate(`/join/${joinContext.joinToken}`)
  }

  React.useEffect(() => {
    // TODO: Got here without setting up media. Where to send them?
    if (!mediaContext?.mediaStream) {
      // TODO: Remove for testing
      onPublisherBroadcast()
      // navigate(`/join/${params.token}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaContext?.mediaStream.id) {
      const { mediaStream } = mediaContext
      setPublishMediaStream(mediaStream)
      console.log('MEDIA', mediaStream)
    }
  }, [mediaContext?.mediaStream])

  React.useEffect(() => {
    if (joinContext.seriesEpisode && joinContext.seriesEpisode.loaded) {
      const { maxParticipants } = joinContext.seriesEpisode.series
      const { streamGuid } = joinContext.seriesEpisode.episode
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
      setMaxParticipants(maxParticipants)
    }
  }, [joinContext.seriesEpisode])

  React.useEffect(() => {
    if (maxParticipants > 0) {
      const half = maxParticipants / 2
      const column = `fit-content(230px)`
      //      const column = `calc((100% / ${half}) - 12px)`
      const style = Array(half).fill(column).join(' ')
      setMaxParticipantGridColumnStyle({
        gridTemplateColumns: style,
      })
    }
  }, [maxParticipants])

  React.useEffect(() => {
    if (data.connection) {
      const { connection } = data
      if (connection && connection.role) {
        setUserRole(connection.role.toLowerCase())
      }
    }
  }, [data.connection])

  React.useEffect(() => {
    if (data.vip && data.vip.participantId !== availableVipParticipant?.participantId) {
      setAvailableVipParticipant(data.vip)
    }
  }, [data.vip])

  React.useEffect(() => {
    if (layout.layout === Layout.STAGE) {
      const vh = window.innerHeight
      const ch = vh - 320 // css subscriberContainer height
      const sh = 124 // css height
      const needsScroll = ch < sh * data.list.length
      setRequiresSubscriberScroll(needsScroll)
    } else {
      setRequiresSubscriberScroll(false)
    }
  }, [data.list, layout])

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onPublisherBroadcast = () => {
    const streamGuid = joinContext.getStreamGuid()
    const { url, request } = getSocketUrl(joinContext.joinToken, joinContext.nickname, streamGuid)
    join(url, request)
  }

  const onPublisherBroadcastInterrupt = () => {
    // TODO
  }

  const onPublisherFail = () => {
    // TODO
  }

  const onLeave = () => {
    // TODO: Redirect to /bye/${joinToken}
    navigate('/')
  }

  const toggleLock = async () => {
    if (joinContext.conferenceLocked) {
      try {
        const result = await joinContext.lock()
        console.log('LOCK', result)
      } catch (e) {
        // TODO:
        console.error(e)
      }
    } else {
      try {
        const result = await joinContext.unlock()
        console.log('UNLOCK', result)
      } catch (e) {
        // TODO: Show Error
        console.error(e)
      }
    }
  }

  const toggleLink = () => {
    setShowLink(!showLink)
  }

  const toggleChat = () => {
    setChatIsHidden(!chatIsHidden)
  }

  const onVolumeChange = (value: number) => {
    if (mainVideoRef && mainVideoRef.current) {
      mainVideoRef.current.setVolume(value / 100)
    }
  }

  const onPublisherCameraToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current) {
      publisherRef.current.toggleCamera(isOn)
    }
  }

  const onPublisherMicrophoneToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current) {
      publisherRef.current.toggleMicrophone(isOn)
    }
  }

  const onLayoutSelect = (layout: number) => {
    const newStyle =
      layout === Layout.FULLSCREEN ? styles.fullscreen : layout === Layout.EMPTY ? styles.empty : styles.stage
    dispatch({ type: 'LAYOUT', layout: layout, style: newStyle })
  }

  const subscriberMenuActions = {
    onMuteAudio: async (participant: Participant, requestMute: boolean) => {
      console.log('MUTE AUDIO', participant)
      const { muteState } = participant
      const requestState = { ...muteState!, audioMuted: requestMute }
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          data.conference.conferenceId,
          cookies.account,
          participant.participantId,
          requestState
        )
      } catch (e) {
        console.error(e)
        // TODO: Show alert.
      }
    },
    onMuteVideo: async (participant: Participant, requestMute: boolean) => {
      console.log('MUTE VIDEO', participant)
      const { muteState } = participant
      const requestState = { ...muteState!, videoMuted: requestMute }
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          data.conference.conferenceId,
          cookies.account,
          participant.participantId,
          requestState
        )
      } catch (e) {
        console.error(e)
        // TODO: Show alert.
      }
    },
    onBan: async (participant: Participant) => {
      // TODO: Show Confirmation?
      console.log('BAN', participant)
      try {
        const result = await CONFERENCE_API_CALLS.banParticipant(
          data.conference.conferenceId,
          cookies.account,
          participant.participantId
        )
      } catch (e) {
        // TODO: Show alert.
        console.error(e)
      }
    },
  }

  return (
    <Box className={classes.rootContainer}>
      {/* Main Video */}
      {mainStreamGuid && (
        <Box sx={layout.style.mainVideoContainer}>
          <Subscriber
            ref={mainVideoRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={mainStreamGuid}
            resubscribe={true}
            styles={layout.style.mainVideo}
            videoStyles={layout.style.mainVideo}
            mute={false}
            showControls={false}
          />
        </Box>
      )}
      <Box className={classes.content}>
        {/* Add / Share Modal */}
        <ShareLinkModal joinToken={joinContext.joinToken} open={showLink} onDismiss={() => setShowLink(false)} />
        {/* Role-based Controls */}
        {data.conference && (
          <Box className={classes.topBar} sx={layout.style.topBar}>
            <Typography className={classes.header}>{data.conference.displayName}</Typography>
            <Stack direction="row" alignItems="center" className={classes.topControls}>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <IconButton
                  sx={{ backdropFilter: 'contrast(0.5)' }}
                  color="primary"
                  aria-label="share link"
                  component="label"
                  onClick={toggleLink}
                >
                  <GroupAdd fontSize="small" />
                </IconButton>
              )}
              {joinContext && userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <IconButton
                  sx={{ marginLeft: '10px', backdropFilter: 'contrast(0.5)' }}
                  color="primary"
                  aria-label="lock unlock watch party"
                  component="label"
                  onClick={toggleLock}
                >
                  {joinContext.conferenceLocked ? <LockOpen fontSize="small" /> : <Lock fontSize="small" />}
                </IconButton>
              )}
              <CustomButton
                size={BUTTONSIZE.SMALL}
                buttonType={BUTTONTYPE.LEAVE}
                startIcon={<LogOutIcon />}
                onClick={onLeave}
              >
                Leave
              </CustomButton>
            </Stack>
          </Box>
        )}
        {/* VIP Video Playback */}
        {availableVipParticipant && (
          <Box sx={layout.style.vipContainer}>
            <VIPSubscriber
              participant={availableVipParticipant}
              styles={layout.style.vipsubscriber}
              videoStyles={layout.style.vipsubscriberVideo}
              host={STREAM_HOST}
              useStreamManager={USE_STREAM_MANAGER}
            />
          </Box>
        )}
        {/* Other Participants Video Playback */}
        <Box sx={layout.style.subscriberList}>
          <Stack spacing={2} sx={{ ...layout.style.subscriberContainer, ...maxParticipantGridColumnStyle }}>
            {data.list.map((s: Participant) => {
              return (
                <MainStageSubscriber
                  key={s.participantId}
                  participant={s}
                  styles={layout.style.subscriber}
                  videoStyles={layout.style.subscriberVideo}
                  host={STREAM_HOST}
                  useStreamManager={USE_STREAM_MANAGER}
                  menuActions={userRole === UserRoles.PARTICIPANT.toLowerCase() ? undefined : subscriberMenuActions}
                />
              )
            })}
            {layout.layout === Layout.FULLSCREEN && <PublisherPortalFullscreen portalNode={portalNode} />}
          </Stack>
          {/* {requiresSubscriberScroll && layout.layout !== Layout.FULLSCREEN && <Button>More...</Button>} */}
        </Box>
        {/* Publisher View - STAGE LAYOUT */}
        {publishMediaStream && layout.layout !== Layout.FULLSCREEN && <PublisherPortalStage portalNode={portalNode} />}
        {/* Bottom Controls / Chat */}
        <Box className={classes.bottomBar}>
          <Stack direction="row" alignItems="bottom" className={classes.bottomControls}>
            {data.conference && (
              <Stack direction="row" spacing={1} className={classes.layoutContainer}>
                <MainStageLayoutSelect layout={layout.layout} onSelect={onLayoutSelect} />
                {/* TODO: Chat? */}
                <Input
                  placeholder="Chat Message"
                  inputProps={{ 'arial-label': 'enter chat message' }}
                  className={classes.chatInput}
                />
              </Stack>
            )}
            {publishMediaStream && ENABLE_MUTE_API && (
              <PublisherControls
                cameraOn={true}
                microphoneOn={true}
                onCameraToggle={onPublisherCameraToggle}
                onMicrophoneToggle={onPublisherMicrophoneToggle}
              />
            )}
            <Box className={classes.partyControls}>
              {mainStreamGuid && (
                <VolumeControl
                  isOpen={false}
                  min={0}
                  max={100}
                  step={1}
                  currentValue={50}
                  onVolumeChange={onVolumeChange}
                />
              )}
              {data.conference && (
                // TODO: Chat?
                <CustomButton
                  size={BUTTONSIZE.SMALL}
                  buttonType={BUTTONTYPE.TRANSPARENT}
                  startIcon={<ChatBubble sx={{ color: 'rgb(156, 243, 97)' }} />}
                  onClick={toggleChat}
                >
                  {chatIsHidden ? 'Show' : 'Hide'} Chat
                </CustomButton>
              )}
            </Box>
          </Stack>
        </Box>
        {/* Loading Message */}
        {!data.conference && (
          <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
            <Loading />
            <Typography>Loading Watch Party</Typography>
          </Stack>
        )}
      </Box>
      {/* Publisher Portal to be moved from one view layout state to another */}
      <portals.InPortal node={portalNode}>
        <Box sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}>
          <Publisher
            key="publisher"
            ref={publisherRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={joinContext.getStreamGuid()}
            stream={mediaContext?.mediaStream}
            styles={layout.layout !== Layout.FULLSCREEN ? layout.style.publisher : layout.style.publisherVideo}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          />
        </Box>
      </portals.InPortal>
    </Box>
  )
}

export default MainStage
