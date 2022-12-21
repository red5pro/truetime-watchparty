import React from 'react'
import * as portals from 'react-reverse-portal'
import { useNavigate } from 'react-router-dom'
import { IconButton, Box, Typography, Stack, Divider, Tooltip, Grid } from '@mui/material'
import LogOutIcon from '@mui/icons-material/Logout'
import {
  Lock,
  LockOpen,
  GroupAdd,
  ChatBubble,
  ExpandMore,
  ScreenShareOutlined,
  StopScreenShareOutlined,
} from '@mui/icons-material'
import { MessageList, MessageInput, TypingIndicator } from '@pubnub/react-chat-components'

import useCookies from '../../hooks/useCookies'
import { API_SOCKET_HOST, ENABLE_MUTE_API, STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import Loading from '../Common/Loading/Loading'
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
import ErrorModal from '../Modal/ErrorModal'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { noop, UserRoles } from '../../utils/commonUtils'
import PublisherPortalStage from './PublisherPortalStage'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import SimpleAlertDialog from '../Modal/SimpleAlertDialog'
import { FatalError } from '../../models/FatalError'
import PickerAdapter from '../ChatBox/PickerAdapter'
import useChatStyles from './ChatStyles.module'
import ScreenShare from '../ScreenShare/ScreenShare'
import { PublisherRef } from '../Publisher'
import ScreenShare2 from '../ScreenShare/ScreenShare2'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

export enum Layout {
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

const WebinarMainStage = () => {
  const { joinToken, seriesEpisode, fingerprint, nickname, getStreamGuid, lock, unlock } = useJoinContext()
  const { mediaStream } = useMediaContext()
  const { error, loading, data, join, retry } = useWatchContext()

  const { classes } = useStyles()
  const { classes: chatClasses } = useChatStyles()

  const navigate = useNavigate()
  const { getCookies } = useCookies(['account'])

  const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), [])

  const mainVideoRef = React.useRef<SubscriberRef>(null)
  const publisherRef = React.useRef<PublisherRef>(null)
  const subscriberListRef = React.useRef<any>(null)

  const [layout, dispatch] = React.useReducer(layoutReducer, { layout: Layout.FULLSCREEN, style: styles.fullscreen })

  const [showLink, setShowLink] = React.useState<boolean>(false)
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT.toLowerCase())
  const [maxParticipants, setMaxParticipants] = React.useState<number>(8) // CHECK WHERE THIS VALUE WILL COME FROM
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()
  const [availableVipParticipant, setAvailableVipParticipant] = React.useState<Participant | undefined>()
  const [requiresSubscriberScroll, setRequiresSubscriberScroll] = React.useState<boolean>(false)
  const [viewportHeight, setViewportHeight] = React.useState<number>(0)
  const [relayout, setRelayout] = React.useState<boolean>(false)
  const [chatIsHidden, setChatIsHidden] = React.useState<boolean>(true)
  const [maxParticipantGridColumnStyle, setMaxParticipantGridColumnStyle] = React.useState<any>({
    gridTemplateColumns:
      'calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px)',
  })

  const [nonFatalError, setNonFatalError] = React.useState<any>()
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()
  const [showBanConfirmation, setShowBanConfirmation] = React.useState<Participant | undefined>()
  const [screenShare, setScreenShare] = React.useState<boolean>(false)
  const [startConference, setStartConference] = React.useState<boolean>(false)

  const getSocketUrl = (token: string, name: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
      messageType: 'JoinConferenceRequest',
    } as ConnectionRequest

    const fp = fingerprint
    request.fingerprint = fp
    const cookies = getCookies()
    if (cookies?.account) {
      // Registered User
      if (cookies.account.token) {
        const { auth, token } = cookies.account
        request.auth = auth
        request.accessToken = token
      } else {
        const { email, password } = cookies.account
        request.username = email
        request.password = password
      }
    }

    return { url: API_SOCKET_HOST, request }
  }

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setViewportHeight(window.innerHeight)
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    // Fatal Socket Error.
    if (error) {
      setFatalError({
        ...(error as any),
        title: 'Connection Error',
        closeLabel: 'RETRY',
        onClose: () => {
          setFatalError(undefined)
          window.location.reload()
        },
      } as FatalError)
    }
  }, [error])

  React.useEffect(() => {
    if (!mediaStream) {
      navigate(`/join/${joinToken}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaStream.id) {
      setPublishMediaStream(mediaStream)
    }
  }, [mediaStream])

  React.useEffect(() => {
    if (maxParticipants > 0) {
      const half = Math.floor(maxParticipants / 2)
      const column = `fit-content(230px)`
      //      const column = `calc((100% / ${half}) - 12px)`
      const style = Array(half).fill(column).join(' ')
      setMaxParticipantGridColumnStyle({
        gridTemplateColumns: style,
      })
    }
  }, [maxParticipants])

  React.useEffect(() => {
    const shutdown = async () => {
      if (publisherRef && publisherRef.current) {
        await publisherRef.current.shutdown()
      }
    }
    if (data.closed) {
      shutdown()
      setFatalError({
        status: 404,
        title: 'Connection Disruption',
        statusText: `Your session was interrupted expectedly. You are no longer in the Watch Party.`,
        closeLabel: 'OK',
        onClose: onLeave,
      } as FatalError)
    }
  }, [data.closed])

  React.useEffect(() => {
    if (data.connection) {
      const { connection } = data
      if (connection && connection.role) {
        setUserRole(connection.role.toLowerCase())
      }
    }
  }, [data.connection])

  React.useEffect(() => {
    if (layout.layout === Layout.STAGE && viewportHeight > 0 && subscriberListRef.current) {
      let needsScroll = false
      try {
        const bounds = subscriberListRef.current?.getBoundingClientRect()
        const lastBounds = subscriberListRef.current?.lastChild?.getBoundingClientRect()
        if (bounds && lastBounds) {
          needsScroll = lastBounds.bottom > bounds.bottom
        }
      } catch (e) {
        // TODO
      }
      setRelayout(false)
      setRequiresSubscriberScroll(needsScroll)
    } else {
      setRequiresSubscriberScroll(false)
    }
  }, [data.list, layout, viewportHeight, relayout])

  const onPublisherBroadcast = () => {
    setStartConference(true)
    const streamGuid = getStreamGuid()
    const { url, request } = getSocketUrl(joinToken, nickname, streamGuid)
    join(url, request)
  }

  const onPublisherBroadcastInterrupt = () => {
    setFatalError({
      status: 400,
      title: 'Broadcast Stream Error',
      statusText: `Your broadcast session was interrupted unexpectedly. You are no longer streaming.`,
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

  const onLeave = () => {
    navigate(`/thankyou/webinar/${joinToken}`)
  }

  const toggleLock = async () => {
    const conferenceId = data.conference.conferenceId
    if (!seriesEpisode.locked) {
      try {
        const result = await lock(conferenceId)
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in locking party.' })
      }
    } else {
      try {
        const result = await unlock(conferenceId)
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in unlocking party.' })
      }
    }
  }

  const toggleLink = () => {
    setShowLink(!showLink)
  }

  const toggleChat = () => {
    setChatIsHidden(!chatIsHidden)
  }

  const onPublisherCameraToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current && publisherRef.current.toggleCamera) {
      publisherRef.current.toggleCamera(isOn)
    }
  }

  const onPublisherMicrophoneToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current && publisherRef.current.toggleMicrophone) {
      publisherRef.current.toggleMicrophone(isOn)
    }
  }

  const onMoreScroll = () => {
    if (subscriberListRef && subscriberListRef.current) {
      subscriberListRef.current.lastChild.scrollIntoView()
    }
  }

  const onRelayout = () => {
    setRelayout(true)
  }

  const onLayoutSelect = (layout: number) => {
    const newStyle =
      layout === Layout.FULLSCREEN ? styles.fullscreen : layout === Layout.EMPTY ? styles.empty : styles.stage
    dispatch({ type: 'LAYOUT', layout: layout, style: newStyle })
  }

  const onShareScreen = (value: boolean) => {
    if (value) {
      onLayoutSelect(Layout.STAGE)
    } else {
      onLayoutSelect(Layout.FULLSCREEN)
    }
    setScreenShare(value)
  }

  const subscriberMenuActions = {
    onMuteAudio: async (participant: Participant, requestMute: boolean) => {
      const { muteState } = participant
      const requestState = { ...muteState!, audioMuted: requestMute }
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          data.conference.conferenceId,
          getCookies().account,
          participant.participantId,
          requestState
        )
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError(e)
      }
    },
    onMuteVideo: async (participant: Participant, requestMute: boolean) => {
      const { muteState } = participant
      const requestState = { ...muteState!, videoMuted: requestMute }
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          data.conference.conferenceId,
          getCookies().account,
          participant.participantId,
          requestState
        )
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError(e)
      }
    },
    onBan: (participant: Participant) => {
      setShowBanConfirmation(participant)
    },
  }

  const onContinueBan = async (participant: Participant) => {
    try {
      const result = await CONFERENCE_API_CALLS.banParticipant(
        data.conference.conferenceId,
        getCookies().account,
        participant.participantId
      )
      if (result.status >= 300) {
        throw result
      }
    } catch (e) {
      console.error(e)
      setNonFatalError(e)
    } finally {
      setShowBanConfirmation(undefined)
    }
  }

  const onScreenShareEnd = () => {
    setScreenShare(false)
    onShareScreen(false)
  }

  const calculateParticipantHeight = (totalParticipants: number) => {
    if (totalParticipants > 2) {
      const total = totalParticipants > 4 ? 4 : totalParticipants
      return `calc(100% - ${total * 4}rem)`
    }

    return '100%'
  }

  const calculateGrid = (totalParticipants: number) => {
    if (totalParticipants < 5) {
      return 12 / totalParticipants
    } else {
      return 3
    }
  }

  return (
    <Box id="root-container" className={classes.rootContainer}>
      {/* Loading Message */}
      {(!data.conference || loading) && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading Watch Party</Typography>
        </Stack>
      )}
      {screenShare && layout.layout !== Layout.FULLSCREEN && (
        <Box id="main-video-container" sx={layout.style.mainVideoContainer}>
          {/* <ScreenShare
            styles={layout.style.subscriberMainVideoContainer}
            videoStyles={layout.style.mainVideo}
            isSharingScreen={screenShare}
            onShareScreen={onShareScreen}
          /> */}
          <ScreenShare2
            owner={getStreamGuid()}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            styles={layout.style.subscriberMainVideoContainer}
            isSharingScreen={screenShare}
            onEnded={onScreenShareEnd}
          />
        </Box>
      )}
      {/* Other Participants Video Playback */}
      <Box id="participants-video-container" sx={layout.style.subscriberList}>
        <Grid
          container
          xs={layout.layout === Layout.FULLSCREEN ? 12 : 4}
          ref={subscriberListRef}
          maxHeight={layout.layout !== Layout.FULLSCREEN ? 'calc(100vh - 10rem)' : '100%'}
          style={
            layout.layout !== Layout.FULLSCREEN
              ? { ...layout.style.subscriberContainer }
              : { ...layout.style.subscriberContainerFull }
          }
        >
          <Grid
            id="grid-stage-publisher"
            item
            sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}
            xs={layout.layout === Layout.FULLSCREEN ? calculateGrid(data.list.length + 1) : 12}
            maxHeight={layout.layout !== Layout.FULLSCREEN ? 'auto' : calculateParticipantHeight(data.list.length + 1)}
          >
            <Publisher
              key="publisher"
              ref={publisherRef}
              useStreamManager={USE_STREAM_MANAGER}
              host={STREAM_HOST}
              streamGuid={getStreamGuid()}
              stream={mediaStream}
              styles={
                layout.layout !== Layout.FULLSCREEN
                  ? layout.style.subscriber
                  : { ...layout.style.publisherVideo, ...layout.style.subscriber }
              }
              onFail={onPublisherFail}
              onStart={onPublisherBroadcast}
              onInterrupt={onPublisherBroadcastInterrupt}
            />
          </Grid>
          {data.list.map((s: Participant) => (
            <Grid
              id="grid-stage-subscriber"
              item
              key={s.participantId}
              xs={layout.layout === Layout.FULLSCREEN ? calculateGrid(data.list.length + 1) : 12}
              maxHeight={
                layout.layout !== Layout.FULLSCREEN ? 'auto' : calculateParticipantHeight(data.list.length + 1)
              }
            >
              <MainStageSubscriber
                participant={s}
                styles={layout.style.subscriber}
                videoStyles={layout.style.subscriberVideo}
                host={STREAM_HOST}
                useStreamManager={USE_STREAM_MANAGER}
                menuActions={userRole === UserRoles.PARTICIPANT.toLowerCase() ? undefined : subscriberMenuActions}
                onSubscribeStart={onRelayout}
                isLayoutFullscreen={layout.layout === Layout.FULLSCREEN}
              />
            </Grid>
          ))}
        </Grid>
        {requiresSubscriberScroll && layout.layout !== Layout.FULLSCREEN && (
          <CustomButton
            className={classes.moreButton}
            size={BUTTONSIZE.SMALL}
            buttonType={BUTTONTYPE.TRANSPARENT}
            onClick={onMoreScroll}
          >
            <ExpandMore />
          </CustomButton>
        )}
        {/* Publisher View - STAGE LAYOUT */}
        {/* {publishMediaStream && layout.layout !== Layout.FULLSCREEN && <PublisherPortalStage portalNode={portalNode} />} */}
      </Box>
      <Box id="organizer-controls-container" className={classes.organizerTopControls}>
        {/* Add / Share Modal */}
        <ShareLinkModal joinToken={joinToken} open={showLink} onDismiss={() => setShowLink(false)} />
        {/* Role-based Controls */}
        {data.conference && (
          <Grid container className={classes.topBar} sx={layout.style.topBar}>
            <Grid item xs={9} display="flex" alignItems="center" justifyContent="center" className={classes.header}>
              <Typography className={classes.headerTitle}>{data.conference.displayName}</Typography>
            </Grid>
            <Grid item xs={3} display="flex" alignItems="center" className={classes.topControls}>
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

              {/** LOCK NOT WORKING FOR NOW */}
              {userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <Tooltip title={seriesEpisode.locked ? 'Locked' : 'Unlocked'}>
                  <IconButton
                    sx={{ marginLeft: '10px', backdropFilter: 'contrast(0.5)' }}
                    color="primary"
                    aria-label="lock unlock watch party"
                    component="label"
                    onClick={toggleLock}
                  >
                    {seriesEpisode.locked ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                  </IconButton>
                </Tooltip>
              )}
              <Lock fontSize="small" />

              <CustomButton
                size={BUTTONSIZE.SMALL}
                buttonType={BUTTONTYPE.LEAVE}
                startIcon={<LogOutIcon />}
                onClick={onLeave}
              >
                Leave
              </CustomButton>
            </Grid>
          </Grid>
        )}
      </Box>
      {/* Bottom Controls / Chat */}
      <Stack
        id="bottom-controls-chat-container"
        className={classes.bottomBar}
        direction="row"
        alignItems="bottom"
        spacing={2}
      >
        {publishMediaStream && ENABLE_MUTE_API && (
          <Stack direction="row" spacing={2} justifyContent="flex-start" className={classes.layoutContainer}>
            <PublisherControls
              cameraOn={true}
              microphoneOn={true}
              onCameraToggle={onPublisherCameraToggle}
              onMicrophoneToggle={onPublisherMicrophoneToggle}
            />
          </Stack>
        )}
        {data.conference && (
          <Stack direction="row" marginY={1} spacing={1} alignItems="flex-end" justifyContent="center">
            {!screenShare ? (
              <CustomButton
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.TRANSPARENT}
                onClick={() => onShareScreen(true)}
                className={classes.shareScreenButton}
              >
                <ScreenShareOutlined />
              </CustomButton>
            ) : (
              <CustomButton
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.LEAVE}
                onClick={() => onShareScreen(false)}
                className={classes.shareScreenButton}
              >
                <StopScreenShareOutlined />
              </CustomButton>
            )}
            <MainStageLayoutSelect layout={layout.layout} onSelect={onLayoutSelect} />

            <Box className={chatClasses.inputChatContainer}>
              {layout.layout === Layout.FULLSCREEN && (
                <Box
                  sx={{ display: chatIsHidden ? 'none' : 'block' }}
                  className={`${chatClasses.fullScreenChatContainer} ${chatClasses.chatContainer} `}
                >
                  <MessageList enableReactions fetchMessages={0} reactionsPicker={<PickerAdapter />}>
                    <TypingIndicator />
                  </MessageList>
                </Box>
              )}
              <Box onClick={() => toggleChat()}>
                <MessageInput
                  typingIndicator
                  emojiPicker={<PickerAdapter />}
                  placeholder="Chat Message"
                  onSend={chatIsHidden ? () => toggleChat() : () => noop()}
                />
              </Box>
            </Box>
          </Stack>
        )}
        <Stack direction="row" spacing={1} className={classes.partyControls}>
          {data.conference && (
            <Box display="flex" flexDirection="column" alignItems="flex-end" className={chatClasses.container}>
              <Box sx={{ display: chatIsHidden ? 'none' : 'block' }} className={chatClasses.chatContainer}>
                <MessageList enableReactions fetchMessages={0} reactionsPicker={<PickerAdapter />}>
                  <TypingIndicator />
                </MessageList>
                {/* <MessageInput typingIndicator emojiPicker={<PickerAdapter />} placeholder="Chat Message" /> */}
              </Box>
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
      </Stack>

      {/* Publisher Portal to be moved from one view layout state to another */}
      {/* <portals.InPortal node={portalNode}>
        <Box sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}>
          <Publisher
            key="publisher"
            ref={publisherRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={getStreamGuid()}
            stream={mediaStream}
            styles={layout.layout !== Layout.FULLSCREEN ? layout.style.publisher : layout.style.publisherVideo}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          />
        </Box>
      </portals.InPortal> */}
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
      {/* Non-Fatal Error */}
      {nonFatalError && (
        <SimpleAlertDialog
          title={nonFatalError.title || 'Error'}
          message={`${nonFatalError.status} - ${nonFatalError.statusText}`}
          confirmLabel="OK"
          onConfirm={() => setNonFatalError(undefined)}
        />
      )}
      {showBanConfirmation && (
        <SimpleAlertDialog
          title="Ban Confirmation"
          message={`Are you sure you want to ban ${showBanConfirmation.displayName}?`}
          confirmLabel="YES"
          denyLabel="NEVERMIND"
          onConfirm={() => {
            onContinueBan(showBanConfirmation)
          }}
          onDeny={() => setShowBanConfirmation(undefined)}
        />
      )}
    </Box>
  )
}

export default WebinarMainStage
