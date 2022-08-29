import React from 'react'
import * as portals from 'react-reverse-portal'
import { useCookies } from 'react-cookie'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import LogoutIcon from '@mui/icons-material/Logout'

import { STREAM_HOST, USE_STREAM_MANAGER } from '../../../settings/variables'
import Subscriber from '../../Subscriber/Subscriber'
import useStyles from './VipMainStage.module'
import MediaContext from '../../MediaContext/MediaContext'
import JoinContext from '../../JoinContext/JoinContext'
import WatchContext from '../../WatchContext/WatchContext'

import styles from './MainStageLayout'
import Publisher from '../../Publisher/Publisher'
import { Participant } from '../../../models/Participant'
import { ConnectionRequest } from '../../../models/ConferenceStatusEvent'
import { UserRoles } from '../../../utils/commonUtils'
// import PublisherPortalStage from './PublisherPortalStage'
// import PublisherPortalFullscreen from './PublisherPortalFullscreen'
import Loading from '../../Loading/Loading'
import PublisherPortalStage from '../../MainStage/PublisherPortalStage'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import { Episode } from '../../../models/Episode'
import WatchpartyParticipants from '../WatchpartyParticipants/WatchpartyParticipants'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import VipTimer from '../VipTimer/VipTimer'
import LeaveMessage from './LeaveMessage/LeaveMessage'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

interface IVipMainStageProps {
  currentEpisode: Episode
  participants: Participant[]
  skipNextConference: () => void
  conferenceDetails: ConferenceDetails
}

const VipMainStage = (props: IVipMainStageProps) => {
  const { currentEpisode, participants, skipNextConference, conferenceDetails } = props

  const joinContext = useJoinContext()
  const { data, message, join } = useWatchContext()
  const mediaContext = useMediaContext()

  const { classes } = useStyles()
  const [cookies] = useCookies(['account'])
  const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), [])

  const [showLink, setShowLink] = React.useState<boolean>(false)
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT.toLowerCase())
  const [maxParticipants, setMaxParticipants] = React.useState<number>(0)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()
  // const [vipParticipant, setVipParticipant] = React.useState<Participant>()
  const [requiresSubscriberScroll, setRequiresSubscriberScroll] = React.useState<boolean>(false)
  const [finishedCountdown, setFinishedCountdown] = React.useState<boolean>(false)
  const [startedCountdown, setStartedCountdown] = React.useState<boolean>(false)

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

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onPublisherBroadcast = () => {
    setStartedCountdown(true)
  }

  const onPublisherBroadcastInterrupt = () => {
    // TODO
  }

  const onPublisherFail = () => {
    // TODO
  }

  const onLeave = () => {
    // TODO: Redirect to /bye/${joinToken}
    location.reload()
  }

  const onLock = () => {
    // TODO: Make service request to lock?
  }

  const onLink = () => {
    // TODO: Show modal with share link
    setShowLink(!showLink)
  }

  return (
    <Box className={classes.rootContainer}>
      <Box width="100%" display="flex" alignItems="center" className={classes.topHeader}>
        <Box display="flex" justifyContent="flex-end" width="50%">
          <Typography textAlign="center">{currentEpisode.displayName}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" width="50%" marginRight="20px">
          <CustomButton
            size={BUTTONSIZE.SMALL}
            buttonType={BUTTONTYPE.LEAVE}
            startIcon={<LogoutIcon />}
            onClick={onLeave}
          >
            Leave
          </CustomButton>
        </Box>
      </Box>
      {!data.conference && !mainStreamGuid && (
        <Box top={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading Watch Party</Typography>
        </Box>
      )}
      {/* Main Video */}
      {mainStreamGuid && (
        <Box height="100%">
          <Subscriber
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={mainStreamGuid}
            resubscribe={false}
            styles={styles.stage.subscriberVideo}
            videoStyles={styles.stage.subscriberVideo}
            mute={true}
            showControls={true}
          />
        </Box>
      )}
      <Box className={classes.content}>
        {/* {showLink && <ShareLink joinToken={joinContext.joinToken} account={cookies.account} />}
        {data.conference && (
          <Box className={classes.topBar}>
            <Typography className={classes.header}>
              Max {maxParticipants} - {data.conference.displayName}
            </Typography>
            <Box className={classes.topControls}>
              <Box>{message}</Box>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && <button onClick={onLink}>add</button>}

              {userRole === UserRoles.ORGANIZER.toLowerCase() && <button onClick={onLock}>lock</button>}
              <button onClick={onLeave}>leave</button>
            </Box>
          </Box>
        )} */}

        {publishMediaStream && <PublisherPortalStage portalNode={portalNode} />}
        {/* {!data.conference && (
          <Box top={2} className={classes.loadingContainer}>
            <Loading />
            <Typography>Loading Watch Party</Typography>
          </Box>
        )} */}
      </Box>

      <Box className={classes.vipOwnVideo} display="flex">
        <Publisher
          key="publisher"
          useStreamManager={USE_STREAM_MANAGER}
          host={STREAM_HOST}
          streamGuid={joinContext.getStreamGuid()}
          stream={mediaContext?.mediaStream}
          styles={styles.stage.publisherVideo}
          onStart={onPublisherBroadcast}
          onFail={onPublisherFail}
          onInterrupt={onPublisherBroadcastInterrupt}
        />
      </Box>
      <Box className={classes.participantsView}>
        {/* CHECK WHEN WE SHOULD DISPLAY THIS */}
        {finishedCountdown ? (
          <LeaveMessage />
        ) : (
          <>
            <VipTimer
              startedCountdown={startedCountdown}
              setFinishedCountdown={setFinishedCountdown}
              finishedCountdown={finishedCountdown}
            />
            <WatchpartyParticipants
              skipNextConference={skipNextConference}
              // NOTE: CHECK IF conferenceDetails IS NEEDED
              conferenceDetails={data.conference ?? conferenceDetails}
              participants={participants}
              onJoinNextParty={() => console.log('join next party here')}
              buttonPrimary
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default VipMainStage
