import React from 'react'
import { IconButton, Box, Typography, Stack, Tooltip, Grid } from '@mui/material'
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

import { ENABLE_MUTE_API, STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import Loading from '../Common/Loading/Loading'

import useStyles from './MainStage.module'

import Publisher from '../Publisher/Publisher'
import { Participant } from '../../models/Participant'
import MainStageSubscriber from '../MainStageSubscriber/MainStageSubscriber'
import ShareLinkModal from '../Modal/ShareLinkModal'
import ErrorModal from '../Modal/ErrorModal'
import { noop, UserRoles } from '../../utils/commonUtils'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'
import SimpleAlertDialog from '../Modal/SimpleAlertDialog'
import PickerAdapter from '../ChatBox/PickerAdapter'
import useChatStyles from './ChatStyles.module'
import ScreenSharePublisher from '../ScreenShare/ScreenSharePublisher'
import { Layout } from './MainStageWrapper'
import { IMainStageWrapperProps } from '.'
import WatchContext from '../WatchContext/WatchContext'
import ScreenShareSubscriber from '../ScreenShareSubscriber/ScreenShareSubscriber'

const WebinarMainStage = (props: IMainStageWrapperProps) => {
  const {
    data,
    loading,
    layout,
    subscriberListRef,
    publisherRef,
    mediaStream,
    userRole,
    subscriberMenuActions,
    requiresSubscriberScroll,
    joinToken,
    showLink,
    seriesEpisode,
    publishMediaStream,
    chatIsHidden,
    fatalError,
    nonFatalError,
    showBanConfirmation,
    isAnonymous,

    setShowBanConfirmation,
    onContinueBan,
    onLayoutSelect,
    getStreamGuid,
    calculateParticipantHeight,
    calculateGrid,
    onAnonymousEntry,
    onPublisherFail,
    onPublisherBroadcastInterrupt,
    onPublisherBroadcast,
    onRelayout,
    onMoreScroll,
    setShowLink,
    toggleLink,
    toggleLock,
    onPublisherCameraToggle,
    onPublisherMicrophoneToggle,
    toggleChat,
    setNonFatalError,
    onLeave,
  } = props

  const { classes } = useStyles()
  const { classes: chatClasses } = useChatStyles()

  const [screenShare, setScreenShare] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (data.screenshareParticipant) {
      onLayoutSelect(Layout.STAGE)
    } else {
      onLayoutSelect(Layout.FULLSCREEN)
    }
  }, [data.screenshareParticipant])

  const onShareScreen = (value: boolean) => {
    if (value) {
      onLayoutSelect(Layout.STAGE)
    } else {
      onLayoutSelect(Layout.FULLSCREEN)
    }
    setScreenShare(value)
  }

  const onScreenShareEnd = () => {
    onShareScreen(false)
  }

  if (isAnonymous) {
    onAnonymousEntry()
  }

  return (
    <Box id="root-container" className={classes.rootContainer}>
      {/* Loading Message */}
      {(!data.conference || loading) && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading Webinar</Typography>
        </Stack>
      )}
      {screenShare && layout.layout !== Layout.FULLSCREEN && (
        <Box id="main-video-container" sx={layout.style.mainVideoContainerWb}>
          <ScreenSharePublisher
            owner={getStreamGuid() || ''}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            styles={{ ...layout.style.subscriberMainVideoContainer, height: '100%' }}
            isSharingScreen={screenShare}
            onEnded={onScreenShareEnd}
          />
        </Box>
      )}
      {data.screenshareParticipant && !screenShare && (
        <Box id="sharescreen-video-container" sx={layout.style.mainVideoContainerWb}>
          <ScreenShareSubscriber
            participantScreenshare={data.screenshareParticipant}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            styles={{ ...layout.style.subscriberMainVideoContainer, height: '100%' }}
            videoStyles={{ ...layout.style.subscriberMainVideoContainer, height: '100%' }}
          />
        </Box>
      )}
      {/* Other Participants Video Playback */}
      <Box
        id="participants-video-container"
        sx={isAnonymous ? layout.style.subscriberListWbAnon : layout.style.subscriberListWb}
        m="auto"
      >
        <Grid
          container
          xs={layout.layout === Layout.FULLSCREEN ? 12 : 4}
          ref={subscriberListRef}
          maxWidth="100%"
          maxHeight={layout.layout !== Layout.FULLSCREEN ? 'calc(100vh - 10rem)' : '100%'}
          width="fit-content"
          flexWrap="nowrap"
          style={layout.layout !== Layout.FULLSCREEN ? { ...layout.style.subscriberContainer } : { ...{ gap: '10px' } }}
        >
          {!isAnonymous && (
            <Grid
              id="grid-stage-publisher"
              item
              sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}
              xs={layout.layout === Layout.FULLSCREEN ? calculateGrid(data.list.length + 1) : 12}
              maxHeight={
                layout.layout !== Layout.FULLSCREEN ? '100%' : calculateParticipantHeight(data.list.length + 1)
              }
            >
              <Publisher
                key="publisher"
                ref={publisherRef}
                useStreamManager={USE_STREAM_MANAGER}
                host={STREAM_HOST}
                streamGuid={getStreamGuid() || ''}
                stream={mediaStream}
                styles={
                  layout.layout !== Layout.FULLSCREEN
                    ? { ...layout.style.subscriber, ...{ transform: 'scaleX(-1)' } }
                    : { ...layout.style.publisherVideo, ...layout.style.subscriber, ...{ transform: 'scaleX(1)' } }
                }
                onFail={onPublisherFail}
                onStart={onPublisherBroadcast}
                onInterrupt={onPublisherBroadcastInterrupt}
              />
            </Grid>
          )}
          {data.list.map((s: Participant) => (
            <Grid
              id="grid-stage-subscriber"
              item
              key={s.participantId}
              xs={layout.layout === Layout.FULLSCREEN ? calculateGrid(data.list.length + 1) : 12}
              maxHeight={
                layout.layout !== Layout.FULLSCREEN ? '100%' : calculateParticipantHeight(data.list.length + 1)
              }
            >
              <MainStageSubscriber
                participant={s}
                styles={{ ...layout.style.subscriber, transform: 'scaleX(1)' }}
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
        <ShareLinkModal joinToken={joinToken || ''} open={showLink} onDismiss={() => setShowLink(false)} />
        {/* Role-based Controls */}
        {data.conference && (
          <Grid container className={classes.webinarTopBar} sx={layout.style.topBar}>
            <Grid
              item
              xs={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={classes.header}
              paddingLeft="15%"
            >
              <Typography className={classes.headerTitle}>{data.conference.displayName}</Typography>
            </Grid>
            <Grid item xs={2} display="flex" alignItems="center" className={classes.topControls}>
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
      {!isAnonymous && (
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
                  disabled={data.screenshareParticipant}
                >
                  <ScreenShareOutlined />
                </CustomButton>
              ) : (
                <CustomButton
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.LEAVE}
                  onClick={onScreenShareEnd}
                  className={classes.shareScreenButton}
                >
                  <StopScreenShareOutlined />
                </CustomButton>
              )}
              <MainStageLayoutSelect layout={layout.layout} onSelect={onLayoutSelect} />

              <Box className={chatClasses.inputChatContainer}>
                {/* {layout.layout === Layout.FULLSCREEN && (
                <Box
                  sx={{ display: chatIsHidden ? 'none' : 'block' }}
                  className={`${chatClasses.fullScreenChatContainer} ${chatClasses.chatContainer} `}
                >
                  <MessageList enableReactions fetchMessages={0} reactionsPicker={<PickerAdapter />}>
                    <TypingIndicator />
                  </MessageList>
                </Box>
              )} */}
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
      )}
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
          title={fatalError!.title || 'Error'}
          message={fatalError!.statusText}
          closeLabel={fatalError!.closeLabel || 'OK'}
          onClose={fatalError!.onClose}
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
          message={`Are you sure you want to ban ${showBanConfirmation!.displayName}?`}
          confirmLabel="YES"
          denyLabel="NEVERMIND"
          onConfirm={() => {
            onContinueBan(showBanConfirmation!)
          }}
          onDeny={() => setShowBanConfirmation(undefined)}
        />
      )}
    </Box>
  )
}

export default WebinarMainStage
