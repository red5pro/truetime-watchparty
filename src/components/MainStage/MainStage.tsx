import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { API_SOCKET_HOST, STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
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
import ShareLink from '../HostAPartySteps/ShareLink/ShareLink'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { UserRoles } from '../../utils/commonUtils'

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

const MainStage = () => {
  const joinContext = useJoinContext()
  const { data, message, join } = useWatchContext()
  const mediaContext = useMediaContext()

  const { classes } = useStyles()
  const navigate = useNavigate()
  const [cookies] = useCookies(['account'])

  const [layout, dispatch] = React.useReducer(layoutReducer, { layout: Layout.STAGE, style: styles.stage })

  const [showLink, setShowLink] = React.useState<boolean>(false)
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT.toLowerCase())
  const [maxParticipants, setMaxParticipants] = React.useState<number>(0)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()
  const [requiresSubscriberScroll, setRequiresSubscriberScroll] = React.useState<boolean>(false)

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
    // TODO: Handle VIP coming and going
    if (!data.vip) {
      // left
    } else {
      // entered
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

  const onLock = () => {
    // TODO: Make service request to lock?
  }

  const onLink = () => {
    // TODO: Show modal with share link
    setShowLink(!showLink)
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
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={mainStreamGuid}
            resubscribe={false}
            styles={layout.style.mainVideo}
            videoStyles={layout.style.mainVideo}
            mute={true}
            showControls={true}
          />
        </Box>
      )}
      <Box className={classes.content}>
        {showLink && <ShareLink joinToken={joinContext.joinToken} account={cookies.account} />}
        {data.conference && (
          <Box className={classes.topBar}>
            <Typography className={classes.header}>
              Max {maxParticipants} - {data.conference.displayName}
            </Typography>
            <Box className={classes.topControls}>
              <Box sx={layout.style.button}>{message}</Box>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && <button onClick={onLink}>add</button>}
              <button onClick={toggleLayout}>layout</button>
              {userRole === UserRoles.ORGANIZER.toLowerCase() && <button onClick={onLock}>lock</button>}
              <button onClick={onLeave}>leave</button>
            </Box>
          </Box>
        )}
        {data.vip && <Typography>{data.vip.displayName}</Typography>}
        {data.list && (
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
        {publishMediaStream && (
          <Box sx={layout.style.publisherContainer}>
            <Publisher
              key="publisher"
              useStreamManager={USE_STREAM_MANAGER}
              host={STREAM_HOST}
              streamGuid={joinContext.getStreamGuid()}
              stream={publishMediaStream}
              styles={layout.style.publisher}
              onStart={onPublisherBroadcast}
              onFail={onPublisherFail}
              onInterrupt={onPublisherBroadcastInterrupt}
            />
          </Box>
        )}
        {!data.conference && (
          <Box top={2} className={classes.loadingContainer}>
            <Loading />
            <Typography>Loading Watch Party</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MainStage
