import React from 'react'
import * as portals from 'react-reverse-portal'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { IconButton, Button, Typography, Stack } from '@mui/material'
import LogOutIcon from '@mui/icons-material/Logout'
import { Box } from '@mui/system'
import Lock from '@mui/icons-material/Lock'
import LockOpen from '@mui/icons-material/LockOpen'
import GroupAdd from '@mui/icons-material/GroupAdd'
import ChatBubble from '@mui/icons-material/ChatBubble'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
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
import ShareLink from '../HostAPartyFlow/ShareLink/ShareLink'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { UserRoles } from '../../utils/commonUtils'
import VIPSubscriber from '../VIPSubscriber/VIPSubscriber'
import PublisherPortalStage from './PublisherPortalStage'
import PublisherPortalFullscreen from './PublisherPortalFullscreen'
import VolumeControl from '../VolumeControl/VolumeControl'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

enum Layout {
  STAGE = 1,
  FULLSCREEN,
}

const layoutReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'TOGGLE':
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
  const [cookies] = useCookies(['account'])
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

  const getSocketUrl = (token: string, name: string, guid: string) => {
    // TODO: Determine if Participant or Registered User?
    // TODO: Where does username & password come from if registered?

    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
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
        // TODO:
        console.error(e)
      }
    }
  }

  const toggleLink = () => {
    // TODO: Show modal with share link
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

  const toggleLayout = () => {
    const newLayout = layout.layout === Layout.STAGE ? Layout.FULLSCREEN : Layout.STAGE
    const newStyle = layout.layout === Layout.STAGE ? styles.fullscreen : styles.stage
    dispatch({ type: 'TOGGLE', layout: newLayout, style: newStyle })
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
            resubscribe={false}
            styles={layout.style.mainVideo}
            videoStyles={layout.style.mainVideo}
            mute={false}
            showControls={false}
          />
        </Box>
      )}
      <Box className={classes.content}>
        {/* Add / Share Modal */}
        {showLink && <ShareLink joinToken={joinContext.joinToken} account={cookies.account} />}
        {/* Role-based Controls */}
        {data.conference && (
          <Box className={classes.topBar}>
            <Typography className={classes.header}>{data.conference.displayName}</Typography>
            <Box className={classes.topControls}>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <IconButton color="primary" aria-label="share link" component="label" onClick={toggleLink}>
                  <GroupAdd />
                </IconButton>
              )}
              {joinContext && userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <IconButton color="primary" aria-label="lock unlock watch party" component="label" onClick={toggleLock}>
                  {joinContext.conferenceLocked ? <LockOpen /> : <Lock />}
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
            </Box>
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
        {/* Other Participants Video Playback - STAGE LAYOUT */}
        {data.list && layout.layout === Layout.STAGE && (
          <Box sx={layout.style.subscriberList}>
            <Box sx={layout.style.subscriberContainer}>
              {data.list.map((s: Participant) => {
                return (
                  <MainStageSubscriber
                    key={s.participantId}
                    participant={s}
                    styles={layout.style.subscriber}
                    videoStyles={layout.style.subscriberVideo}
                    host={STREAM_HOST}
                    useStreamManager={USE_STREAM_MANAGER}
                  />
                )
              })}
            </Box>
            {requiresSubscriberScroll && <Button>More...</Button>}
          </Box>
        )}
        {/* Participants Video Playback - FULLSCREEN LAYOUT */}
        {data.list && layout.layout === Layout.FULLSCREEN && (
          <Box sx={layout.style.subscriberList}>
            {/* Two Rows */}
            <Box sx={layout.style.subscriberContainer}>
              {data.list.map((s: Participant, i: number) => {
                if (i + 1 > maxParticipants / 2) return undefined
                return (
                  <MainStageSubscriber
                    key={s.participantId}
                    participant={s}
                    styles={layout.style.subscriber}
                    videoStyles={layout.style.subscriberVideo}
                    host={STREAM_HOST}
                    useStreamManager={USE_STREAM_MANAGER}
                  />
                )
              })}
            </Box>
            <Box sx={layout.style.subscriberContainer}>
              {data.list.map((s: Participant, i: number) => {
                if (i < maxParticipants / 2) return undefined
                return (
                  <MainStageSubscriber
                    key={s.participantId}
                    participant={s}
                    styles={layout.style.subscriber}
                    videoStyles={layout.style.subscriberVideo}
                    host={STREAM_HOST}
                    useStreamManager={USE_STREAM_MANAGER}
                  />
                )
              })}
              <PublisherPortalFullscreen portalNode={portalNode} />
            </Box>
          </Box>
        )}
        {/* Publisher View - STAGE LAYOUT */}
        {publishMediaStream && layout.layout === Layout.STAGE && <PublisherPortalStage portalNode={portalNode} />}
        {/* Bottom Controls / Chat */}
        {data.conference && (
          <Box className={classes.bottomBar}>
            <Stack direction="row" alignItems="bottom" className={classes.bottomControls}>
              {publishMediaStream && (
                <PublisherControls
                  cameraOn={true}
                  microphoneOn={true}
                  onCameraToggle={onPublisherCameraToggle}
                  onMicrophoneToggle={onPublisherMicrophoneToggle}
                />
              )}
              {data.conference && (
                <Box className={classes.partyControls}>
                  <VolumeControl
                    isOpen={false}
                    min={0}
                    max={100}
                    step={1}
                    currentValue={50}
                    onVolumeChange={onVolumeChange}
                  />
                  <CustomButton
                    size={BUTTONSIZE.SMALL}
                    buttonType={BUTTONTYPE.TRANSPARENT}
                    startIcon={<ChatBubble sx={{ color: 'rgb(156, 243, 97)' }} />}
                    onClick={toggleChat}
                  >
                    {chatIsHidden ? 'Show' : 'Hide'} Chat
                  </CustomButton>
                </Box>
              )}
            </Stack>
          </Box>
        )}
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
        <Box sx={layout.layout === Layout.STAGE ? layout.style.publisherContainer : layout.style.subscriber}>
          <Publisher
            key="publisher"
            ref={publisherRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={joinContext.getStreamGuid()}
            stream={mediaContext?.mediaStream}
            styles={layout.layout === Layout.STAGE ? layout.style.publisher : layout.style.publisherVideo}
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
