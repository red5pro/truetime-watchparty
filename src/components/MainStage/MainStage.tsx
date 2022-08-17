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

  const [layout, dispatch] = React.useReducer(layoutReducer, { layout: Layout.STAGE, style: styles.stage })

  // const [layout, setLayout] = React.useState<Layout>(Layout.STAGE)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()

  const getSocketUrl = (token: string, name: string, guid: string) => {
    // TODO: Determine if Participant or Registered User?
    // TODO: Where does username & password come from if registered?

    const fp = joinContext.fingerprint

    // Participant
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${token}&displayName=${name}&streamGuid=${guid}&fingerprint=123`

    // Registered User
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${joinToken}&displayName=${displayName}&streamGuid=${guid}&username=${username}&password=${password}`

    // Local testing
    const url = `ws://localhost:8001?joinToken=${token}&displayName=${name}&streamGuid=${guid}&fingerprint=${fp}`

    return url
  }

  if (!mediaContext?.mediaStream) {
    // TODO: Navigate back to auth?
    // TODO: If have auth context, navigate back to join?
    navigate(`/join/${joinContext.joinToken}`)
  }

  React.useEffect(() => {
    // TODO: Got here without setting up media. Where to send them?
    if (!mediaContext?.mediaStream) {
      // navigate(`/join/${params.token}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaContext?.mediaStream.id) {
      const { mediaStream } = mediaContext
      setPublishMediaStream(mediaStream)
      console.log('MEDIA', mediaStream)
    }
  }, [mediaContext?.mediaStream])

  React.useEffect(() => {
    if (data.conference) {
      const { streamGuid } = data.conference
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
    }
  }, [data.conference])

  React.useEffect(() => {
    // TODO: Handle VIP coming and going
    if (!data.vip) {
      // left
    } else {
      // entered
    }
  }, [data.vip])

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onPublisherBroadcast = () => {
    const streamGuid = joinContext.getStreamGuid()
    join(getSocketUrl(joinContext.joinToken, joinContext.nickname, streamGuid))
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
        {data.conference && (
          <Box className={classes.topBar}>
            <Typography className={classes.header}>{data.conference.displayName}</Typography>
            <Box className={classes.topControls}>
              <Box sx={layout.style.button}>{message}</Box>
              <button onClick={onLink}>add</button>
              <button onClick={toggleLayout}>layout</button>
              <button onClick={onLock}>lock</button>
              <button onClick={onLeave}>leave</button>
            </Box>
          </Box>
        )}
        {data.vip && <Typography>{data.vip.displayName}</Typography>}
        {data.list && (
          <Box sx={layout.style.subscriberContainer}>
            {data.list.map((s: Participant) => {
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
