import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
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
  const joinContext = React.useContext(JoinContext.Context)
  const watchContext = React.useContext(WatchContext.Context)
  const mediaContext = React.useContext(MediaContext.Context)

  const { classes } = useStyles()
  const navigate = useNavigate()

  const [layout, dispatch] = React.useReducer(layoutReducer, { layout: Layout.STAGE, style: styles.stage })

  // const [layout, setLayout] = React.useState<Layout>(Layout.STAGE)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()

  const getSocketUrl = (token: string, name: string, guid: string) => {
    // TODO: Determine if Participant or Registered User?
    // TODO: Where does fingerprint come from if participant?
    // TODO: Where does username & password come from if registered?

    // Participant
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${token}&displayName=${name}&streamGuid=${guid}&fingerprint=123`

    // Registered User
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${joinToken}&displayName=${displayName}&streamGuid=${guid}&username=${username}&password=${password}`

    // Local testing
    const url = `ws://localhost:8001?joinToken=${token}&displayName=${name}&streamGuid=${guid}`

    return url
  }

  if (!mediaContext || !mediaContext.mediaStream) {
    // TODO: Navigate back to auth?
    // TODO: If have auth context, navigate back to join?
    navigate(`/join/${joinContext.joinToken}`)
  }

  React.useEffect(() => {
    // TODO: Got here without setting up media. Where to send them?
    if (!mediaContext || !mediaContext.mediaStream) {
      // navigate(`/join/${params.token}?u_id=${query.get('u_id')}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaContext?.mediaStream.id) {
      setPublishMediaStream(mediaContext?.mediaStream)
      console.log('MEDIA', mediaContext?.mediaStream)
    }
  }, [mediaContext?.mediaStream])

  React.useEffect(() => {
    if (publishMediaStream) {
      // TODO: Move to post publishing...
      // const streamGuid = joinContext.getStreamGuid()
      // watchContext.join(getSocketUrl(joinContext.joinToken, joinContext.nickname, streamGuid))
    }
    return () => {
      watchContext.leave()
    }
  }, [publishMediaStream])

  React.useEffect(() => {
    if (watchContext.conferenceStatus) {
      const { streamGuid } = watchContext.conferenceStatus
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
    }
  }, [watchContext.conferenceStatus])

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onPublisherBroadcast = () => {
    const streamGuid = joinContext.getStreamGuid()
    watchContext.join(getSocketUrl(joinContext.joinToken, joinContext.nickname, streamGuid))
  }

  const onPublisherBroadcastInterrupt = () => {
    // TODO
  }

  const onPublisherFail = () => {
    // TODO
  }

  const onLeave = () => {
    // TODO: Redirect to /bye/${joinToken}
  }

  const onLock = () => {
    // TODO: Make service request to lock?
  }

  const onLink = () => {
    // TODO: Show modal with share link
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
            mute={true}
            showControls={true}
          />
        </Box>
      )}
      <Box className={classes.content}>
        {watchContext.conferenceStatus && (
          <Box className={classes.topBar}>
            <Typography className={classes.header}>{watchContext.conferenceStatus.displayName}</Typography>
            <Box className={classes.topControls}>
              <Box sx={layout.style.button}>{watchContext.message}</Box>
              <button onClick={onLink}>add</button>
              <button onClick={toggleLayout}>layout</button>
              <button onClick={onLock}>lock</button>
              <button onClick={onLeave}>leave</button>
            </Box>
          </Box>
        )}
        {watchContext.streamsList && (
          <Box sx={layout.style.subscriberContainer}>
            {watchContext.streamsList.map((s: Participant) => {
              return (
                <MainStageSubscriber
                  key={s.participantId}
                  participant={s}
                  styles={layout.style.subscriber}
                  host={STREAM_HOST}
                  useStreamManager={USE_STREAM_MANAGER}
                />
              )
            })}
          </Box>
        )}
        {publishMediaStream && (
          <Box sx={layout.style.publisherContainer}>
            <Publisher
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
        {!watchContext.conferenceStatus && (
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
