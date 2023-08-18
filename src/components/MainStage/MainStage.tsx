import React from 'react'
import * as portals from 'react-reverse-portal'
import { useNavigate } from 'react-router-dom'
import { IconButton, Box, Typography, Stack, Divider, Tooltip, Grid } from '@mui/material'
import LogOutIcon from '@mui/icons-material/Logout'
import { Lock, LockOpen, GroupAdd, ChatBubble, ExpandMore } from '@mui/icons-material'
import { MessageList, MessageInput, TypingIndicator } from '@pubnub/react-chat-components'

import {
  ENABLE_MUTE_API,
  isWatchParty,
  STREAM_HOST,
  USE_STREAM_MANAGER,
  PREFER_WHIP_WHEP,
} from '../../settings/variables'
import Loading from '../Common/Loading/Loading'
import Subscriber from '../Subscriber/Subscriber'

import useStyles from './MainStage.module'

import Publisher from '../Publisher/Publisher'
import { Participant, ParticipantMuteState } from '../../models/Participant'
import MainStageSubscriber from '../MainStageSubscriber/MainStageSubscriber'
import ShareLinkModal from '../Modal/ShareLinkModal'
import ErrorModal from '../Modal/ErrorModal'
import { noop, UserRoles } from '../../utils/commonUtils'
import VIPSubscriber from '../VIPSubscriber/VIPSubscriber'
import PublisherPortalStage from './PublisherPortalStage'
import VolumeControl from '../VolumeControl/VolumeControl'
import PublisherControls from '../PublisherControls/PublisherControls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'
import SimpleAlertDialog from '../Modal/SimpleAlertDialog'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import PickerAdapter from '../ChatBox/PickerAdapter'
import useChatStyles from './ChatStyles.module'
import { IMainStageWrapperProps } from '.'
import { Layout } from './MainStageWrapper'
import PublisherPortalFullscreen from './PublisherPortalFullscreen'

interface SubscriberRef {
  setVolume(value: number): any
}

interface IMainStageProps extends IMainStageWrapperProps {
  mainStreamGuid: string | undefined
  setPublishMediaStream: (value: MediaStream | undefined) => void
  maxParticipantGridColumnStyle: any
}

const MainStage = (props: IMainStageProps) => {
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
    mainStreamGuid,
    maxParticipantGridColumnStyle,
    isAnonymous, // no anonymous viewing in Watch Party mode. Ignored and will redirect on `/join/anon/${token}`.

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
    setPublishMediaStream,
    onLeave,
  } = props

  const { classes } = useStyles()
  const navigate = useNavigate()

  const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), [])

  const mainVideoRef = React.useRef<SubscriberRef>(null)

  const [availableVipParticipant, setAvailableVipParticipant] = React.useState<Participant | undefined>()

  const { classes: chatClasses } = useChatStyles()

  if (!mediaStream || !getStreamGuid()) {
    navigate(`/join/${joinToken}`)
  }

  React.useEffect(() => {
    if (!mediaStream) {
      navigate(`/join/${joinToken}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaStream.id) {
      setPublishMediaStream(mediaStream)
    }
  }, [mediaStream])

  React.useEffect(() => {
    if (data.vip && data.vip.participantId !== availableVipParticipant?.participantId) {
      setAvailableVipParticipant(data.vip)
    } else if (!data.vip) {
      setAvailableVipParticipant(undefined)
    }
  }, [data.vip])

  const onVolumeChange = (value: number) => {
    if (mainVideoRef && mainVideoRef.current) {
      mainVideoRef.current.setVolume(value / 100)
    }
  }

  return (
    <Box className={classes.rootContainer}>
      {/* Main Video */}
      {mainStreamGuid && (
        <Box sx={layout.style.mainVideoContainer}>
          <Subscriber
            ref={mainVideoRef}
            useStreamManager={USE_STREAM_MANAGER}
            preferWhipWhep={PREFER_WHIP_WHEP}
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
        <ShareLinkModal joinToken={joinToken || ''} open={showLink} onDismiss={() => setShowLink(false)} />
        {/* Role-based Controls */}
        {data.conference && (
          <Box className={classes.topBar} sx={layout.style.topBar}>
            <Grid
              direction="row"
              alignItems="center"
              xs={8}
              display="flex"
              width="100%"
              paddingY={2}
              justifyContent="center"
              className={classes.header}
            >
              <WbcLogoSmall />
              <Divider orientation="vertical" flexItem className={classes.headerDivider} />
              <Typography className={classes.headerTitle}>{data.conference.displayName}</Typography>
            </Grid>
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
              {userRole !== UserRoles.ANONYMOUS.toLowerCase() && (
                <CustomButton
                  size={BUTTONSIZE.SMALL}
                  buttonType={BUTTONTYPE.LEAVE}
                  startIcon={<LogOutIcon />}
                  onClick={onLeave}
                >
                  Leave
                </CustomButton>
              )}
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
              preferWhipWhep={PREFER_WHIP_WHEP}
            />
          </Box>
        )}
        {/* Other Participants Video Playback */}
        <Box sx={layout.style.subscriberList}>
          <div
            ref={subscriberListRef}
            style={{ ...layout.style.subscriberContainer, ...maxParticipantGridColumnStyle, width: '100%' }}
          >
            {data.list.map((s: Participant) => {
              return (
                <MainStageSubscriber
                  key={s.participantId}
                  participant={s}
                  styles={layout.style.subscriber}
                  videoStyles={layout.style.subscriberVideo}
                  host={STREAM_HOST}
                  useStreamManager={USE_STREAM_MANAGER}
                  preferWhipWhep={PREFER_WHIP_WHEP}
                  menuActions={userRole === UserRoles.PARTICIPANT.toLowerCase() ? undefined : subscriberMenuActions}
                  onSubscribeStart={onRelayout}
                />
              )
            })}
            {layout.layout === Layout.FULLSCREEN && <PublisherPortalFullscreen portalNode={portalNode} />}
          </div>
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
          {publishMediaStream && layout.layout !== Layout.FULLSCREEN && (
            <PublisherPortalStage portalNode={portalNode} />
          )}
        </Box>
        {/* Bottom Controls / Chat */}
        <Stack className={classes.bottomBar} direction="row" alignItems="bottom" spacing={2}>
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
            <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="center">
              <MainStageLayoutSelect layout={layout.layout} onSelect={onLayoutSelect} />

              <Box className={chatClasses.inputChatContainer}>
                {layout.layout === Layout.FULLSCREEN && (
                  <Box className={`${chatClasses.fullScreenChatContainer} ${chatClasses.chatContainer} `}>
                    <MessageList enableReactions fetchMessages={0} reactionsPicker={<PickerAdapter />}>
                      <TypingIndicator />
                    </MessageList>
                  </Box>
                )}
                <MessageInput typingIndicator emojiPicker={<PickerAdapter />} placeholder="Chat Message" />
              </Box>
            </Stack>
          )}
          <Stack direction="row" spacing={1} className={classes.partyControls}>
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
            {data.conference && layout.layout !== Layout.FULLSCREEN && (
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
        {/* Loading Message */}
        {(!data.conference || loading) && (
          <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
            <Loading />
            <Typography>Loading {isWatchParty ? 'Watch Party' : 'Webinar'}</Typography>
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
            preferWhipWhep={PREFER_WHIP_WHEP}
            host={STREAM_HOST}
            streamGuid={getStreamGuid() || ''}
            stream={mediaStream}
            muteState={publishMuteState}
            styles={layout.layout !== Layout.FULLSCREEN ? layout.style.publisher : layout.style.publisherVideo}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          />
        </Box>
      </portals.InPortal>
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

export default MainStage
