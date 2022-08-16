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

const MainStage = () => {
  const joinContext = React.useContext(JoinContext.Context)
  const watchContext = React.useContext(WatchContext.Context)
  const mediaContext = React.useContext(MediaContext.Context)

  const { classes } = useStyles()
  const navigate = useNavigate()

  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()

  const getSocketUrl = (token: string, name: string) => {
    // TODO: Determine if Participant or Registered User?
    // TODO: Where does fingerprint come from if participant?
    // TODO: Where does username & password come from if registered?

    // Participant
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${token}&displayName=${name}&fingerprint=123`

    // Registered User
    // const url = `wss://${API_SOCKET_HOST}?joinToken=${joinToken}&displayName=${displayName}&username=${username}&password=${password}`

    // Local testing
    const url = `ws://localhost:8001?joinToken=${token}`

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
      watchContext.join(getSocketUrl(joinContext.joinToken, joinContext.nickname))
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

  return (
    <Box className={classes.rootContainer}>
      {/* Main Video */}
      {mainStreamGuid && (
        <Subscriber
          useStreamManager={USE_STREAM_MANAGER}
          host={STREAM_HOST}
          streamGuid={mainStreamGuid}
          resubscribe={false}
          styles={classes.mainVideo}
        />
      )}
      <Box className={classes.content}>
        {!watchContext.conferenceStatus && <Loading />}
        <p>{watchContext.message}</p>
      </Box>
    </Box>
  )
}

export default MainStage
