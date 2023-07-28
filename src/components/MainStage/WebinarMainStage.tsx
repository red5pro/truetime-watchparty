import React from 'react'
import { IconButton, Box, Typography, Stack, Tooltip, Grid } from '@mui/material'
import LogOutIcon from '@mui/icons-material/Logout'
import {
  Lock,
  LockOpen,
  GroupAdd,
  ChatBubble,
  ExpandMore,
  PersonAddAlt1,
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
import ErrorModal from '../Modal/ErrorModal'
import { noop, UserRoles } from '../../utils/commonUtils'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'
import PickerAdapter from '../ChatBox/PickerAdapter'
import useChatStyles from './ChatStyles.module'
import { Layout } from './MainStageWrapper'
import { IMainStageWrapperProps } from '.'
import ScreenSharePublisher from '../ScreenShare/ScreenSharePublisher'
import ScreenShareSubscriber from '../ScreenShareSubscriber/ScreenShareSubscriber'

const ShareLinkModal = React.lazy(() => import('../Modal/ShareLinkModal'))
const AddCoHostsModal = React.lazy(() => import('../Modal/AddCoHostModal/AddCoHostsModal'))
const SimpleAlertDialog = React.lazy(() => import('../Modal/SimpleAlertDialog'))

const WebinarMainStage = (props: IMainStageWrapperProps) => {
  const {
    data,
    loading,
    layout,
    subscriberListRef,
    publisherRef,
    mediaStream,
    publishMuteState,
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
  const [openAddCohostModal, setOpenAddCohostModal] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (data.screenshareParticipants.length > 0 || screenShare) {
      onLayoutSelect(Layout.STAGE)
    } else {
      onLayoutSelect(Layout.FULLSCREEN)
    }
  }, [data.screenshareParticipants])

  React.useEffect(() => {
    if (data.closeCurrentScreenShare && data.screenshareParticipants.length > 0) {
      onScreenShareEnd()
    }
  }, [data.closeCurrentScreenShare, data.screenshareParticipants])

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

  const toggleCohostModal = () => {
    setOpenAddCohostModal(!openAddCohostModal)
  }

  return (
    <Box id="root-container" className={classes.rootContainer} position="fixed" overflow="hidden">
      {/* Loading Message */}
      {(!data.conference || loading) && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading Webinar</Typography>
        </Stack>
      )}
      {screenShare && (
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
      {data.screenshareParticipants?.length > 0 && !screenShare && (
        <Box id="sharescreen-video-container" sx={layout.style.mainVideoContainerWb}>
          {data.screenshareParticipants.map((sc: Participant) => (
            <ScreenShareSubscriber
              key={sc.screenshareGuid}
              participantScreenshare={sc}
              useStreamManager={USE_STREAM_MANAGER}
              host={STREAM_HOST}
              styles={{ ...layout.style.subscriberMainVideoContainer, height: '100%' }}
              videoStyles={{ ...layout.style.subscriberMainVideoContainer, height: '100%' }}
            />
          ))}
        </Box>
      )}
      {/* Other Participants Video Playback */}
      <Box
        id="participants-video-container"
        sx={isAnonymous ? layout.style.subscriberListWbAnon : layout.style.subscriberListWb}
        m={1}
      >
        <Grid
          container
          ref={subscriberListRef}
          minHeight={layout.layout !== Layout.FULLSCREEN ? 'unset' : 'auto'}
          maxHeight={layout.layout !== Layout.FULLSCREEN ? 'calc(100vh - 7rem)' : 'auto'}
          width={layout.layout !== Layout.FULLSCREEN ? '100%' : 'fit-content'}
          minWidth={layout.layout !== Layout.FULLSCREEN ? '100%' : 'auto'}
          flexWrap={
            layout.layout !== Layout.FULLSCREEN || (layout.layout === Layout.FULLSCREEN && data.list.length < 3)
              ? 'nowrap'
              : 'wrap'
          }
          style={
            layout.layout !== Layout.FULLSCREEN
              ? layout.style.subscriberContainer
              : layout.style.subscriberContainerFull
          }
        >
          {!isAnonymous && (
            <Grid
              id="grid-stage-publisher"
              item
              sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}
              xs={layout.layout === Layout.FULLSCREEN ? calculateGrid(data.list.length + 1) : 12}
              maxHeight={layout.layout !== Layout.FULLSCREEN ? '124px' : data.list.length < 3 ? '100%' : '50%'}
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
              sx={layout.layout !== Layout.FULLSCREEN ? layout.style.publisherContainer : layout.style.subscriber}
              maxHeight={layout.layout !== Layout.FULLSCREEN ? '124px' : data.list.length < 3 ? '100%' : '50%'}
            >
              <MainStageSubscriber
                participant={s}
                styles={{ ...layout.style.subscriber }}
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

        {/* Add CoHost Modal */}
        {data?.conference?.conferenceId && openAddCohostModal && (
          <AddCoHostsModal
            conferenceId={data?.conference?.conferenceId}
            open={openAddCohostModal}
            onDismiss={toggleCohostModal}
          />
        )}

        {/* Role-based Controls */}
        {data.conference && (
          <Grid container className={classes.webinarTopBar} sx={layout.style.topBar}>
            <Grid
              item
              xs={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={classes.header}
              paddingLeft="20%"
            >
              <Typography className={classes.headerTitle}>{data.conference.displayName}</Typography>
            </Grid>
            <Grid item xs={4} display="flex" alignItems="center" className={classes.topControls}>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && (
                <>
                  <Tooltip title="Add Cohost">
                    <IconButton
                      sx={{ backdropFilter: 'contrast(0.5)', marginRight: '10px' }}
                      color="primary"
                      aria-label="add cohost"
                      component="label"
                      onClick={toggleCohostModal}
                    >
                      <PersonAddAlt1 fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share Link">
                    <IconButton
                      sx={{ backdropFilter: 'contrast(0.5)' }}
                      color="primary"
                      aria-label="share link"
                      component="label"
                      onClick={toggleLink}
                    >
                      <GroupAdd fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
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
                muteState={publishMuteState}
                onCameraToggle={onPublisherCameraToggle}
                onMicrophoneToggle={onPublisherMicrophoneToggle}
              />
            </Stack>
          )}
          {data.conference && (
            <Stack direction="row" marginY={1} spacing={1} alignItems="center" justifyContent="center">
              {(userRole === UserRoles.ORGANIZER.toLowerCase() || userRole === UserRoles.COHOST.toLowerCase()) && (
                <>
                  {!screenShare ? (
                    <Tooltip
                      title={data?.screenshareParticipants?.length > 0 ? 'Take Over' : 'Share Screen'}
                      placement="top"
                    >
                      <IconButton
                        sx={{ marginLeft: '10px', backdropFilter: 'contrast(0.5)' }}
                        color="primary"
                        aria-label="start a screen share"
                        component="label"
                        onClick={() => onShareScreen(true)}
                      >
                        <ScreenShareOutlined />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Stop Share Screen">
                      <IconButton
                        sx={{ marginLeft: '10px', backdropFilter: 'contrast(0.5)' }}
                        color="primary"
                        aria-label="stop screen share"
                        component="label"
                        onClick={onScreenShareEnd}
                      >
                        <StopScreenShareOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
              {(data.screenshareParticipants?.length > 0 || screenShare) && (
                <MainStageLayoutSelect layout={layout.layout} onSelect={onLayoutSelect} />
              )}

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
