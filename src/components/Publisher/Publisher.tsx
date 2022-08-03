import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import { RTCPublisher, RTCPublisherEventTypes } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import { getAuthenticationParams, getConfiguration } from '../../utils/publishUtils'
import WatchContext from '../WatchContext/WatchContext'
import RoomContext from '../RoomContext/RoomContext'
import Loading from '../Loading/Loading'
import MainVideo from '../MainVideo/MainVideo'
import { Box, Typography } from '@mui/material'
import { SERVER_HOST } from '../../settings/variables'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import usePublisherStyles from './Publisher.module'
import SubscribersPanelList from '../SubscribersPanel/SubscribersPanelList'
import CurrentStreamVideo from '../SubscribersPanel/SubscribersPanel'

const Publisher = () => {
  const watchContext = React.useContext(WatchContext.Context)
  const roomContext = React.useContext(RoomContext.Context)

  const [elementId, setElementId] = React.useState<string>('')
  const [bitrateTrackingTicket, setBitrateTrackingTicket] = React.useState<string>('')
  const [isPublished, setIsPublished] = React.useState<boolean>(false)
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false)
  const [publisher, setPublisher] = React.useState<any>()

  const [readyToPublish, setReadyToPublish] = React.useState<boolean>(false)

  const { classes } = usePublisherStyles()

  React.useEffect(() => {
    const streamNameField = Math.floor(Math.random() * 0x10000).toString(16)
    setElementId(`${streamNameField}-publisher`)
  }, [])

  React.useEffect(() => {
    if (readyToPublish && roomContext?.room && roomContext.currentStreamName) {
      doPublish(roomContext?.room, roomContext?.currentStreamName)
    }
  }, [readyToPublish])

  const getUserMediaConfiguration = (configuration: any) => {
    return {
      mediaConstraints: {
        audio: configuration.useAudio ? configuration.mediaConstraints.audio : false,
        // video: configuration.useVideo ? configuration.mediaConstraints.video : false,
        video: {
          width: {
            exact: 640,
          },
          height: {
            exact: 480,
          },
          frameRate: {
            min: 8,
            max: 24,
          },
        },
      },
    }
  }

  const onResolutionUpdate = (frameWidth: number, frameHeight: number) => {
    // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
  }

  const onPublishSuccess = (publisher: any, roomName: string, streamName: string) => {
    setPublisher(publisher)

    if (publisher.getType().toUpperCase() !== 'RTC') {
      watchContext.methods.establishSocketHost(roomName, roomContext?.currentStreamName ?? '')
    }
    try {
      const connection = publisher.getPeerConnection()
      const senders = connection.getSenders()
      const sender = senders.find((s: RTCRtpSender) => s.track && s.track.kind === 'video')
      const broadcastTrack = sender.track.clone()
      broadcastTrack.enabled = true
      sender.replaceTrack(broadcastTrack)

      const stream = publisher.getMediaStream()
      const bitrateTrackingTicket = watchContext.methods.trackBitrate(
        connection,
        null,
        false,
        true,
        roomName,
        streamName
      )

      setBitrateTrackingTicket(bitrateTrackingTicket)

      stream.getVideoTracks().forEach((track: any) => {
        const settings = track.getSettings()
        onResolutionUpdate(settings.width, settings.height)
      })
    } catch (e) {
      console.log('error', e)
    }
  }

  const determinePublisher = async (room: string, name: string) => {
    const configuration = { ...getConfiguration(), mediaElementId: elementId }
    const authParams = getAuthenticationParams(configuration)
    const userMediaConf = getUserMediaConfiguration(configuration)

    const config = Object.assign(
      {},
      configuration,
      {
        streamMode: configuration.recordBroadcast ? 'record' : 'live',
      },
      authParams,
      userMediaConf
    )

    const rtcConfig = Object.assign({}, config, {
      protocol: watchContext.methods.getSocketLocationFromProtocol().protocol,
      port: watchContext.methods.getSocketLocationFromProtocol().port,
      host: SERVER_HOST,
      bandwidth: {
        video: 750,
        audio: 56,
      },
      app: `live/${room}`,
      streamName: name,
      clearMediaOnUnpublish: true,
    })

    const stream = roomContext?.mediaStream
    const publisher = new RTCPublisher()
    const publisherInit = await publisher.initWithStream(rtcConfig, stream)

    return publisherInit
  }

  const notifyOfPublishFailure = () => {
    console.log('There seems to be an issue with broadcasting your stream. Please reload this page and join again.')
    alert('There seems to be an issue with broadcasting your stream. Please reload this page and join again.')
  }

  const onPublisherEvent = (event: any) => {
    if (event.type === 'WebSocket.Message.Unhandled') {
      console.log(event)
    } else if (event.type === RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE) {
      //      window.allowMediaStreamSwap(targetPublisher, targetPublisher.getOptions().mediaConstraints, document.getElementById('red5pro-publisher'));
    } else if (event.type === 'Publisher.Connection.Closed') {
      notifyOfPublishFailure()
    }
    watchContext.methods.updateSuscriberStatusFromEvent(event)
    return
  }

  const doPublish = async (room: string, name: string) => {
    try {
      setIsPublishing(true)

      const targetPublisher = await determinePublisher(room, name)
      targetPublisher.on('*', onPublisherEvent)
      await targetPublisher.publish(name)

      onPublishSuccess(targetPublisher, room, name)
      window.history.pushState(null, '', `${room}`)
      // window.history.pushState(null, '', `${room}/${roomContext?.mainEventStreamName}`)
    } catch (error) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProPublisher] :: Error in publishing - ' + jsonError)
      console.error(error)

      // onPublishFail(jsonError)
    } finally {
      setIsPublished(true)
      setIsPublishing(false)
    }
  }

  const createEvent = async (values: IRoomFormValues) => {
    if (roomContext?.mediaStream) {
      roomContext.setRoomName(values.room)
      roomContext.setCurrentStreamName(values.name)

      setReadyToPublish(true)
    }
  }

  const hangOff = async () => {
    try {
      const { hostSocket, setHostSocket } = watchContext

      setHostSocket(hostSocket.close())

      publisher.unpublish().then(() => {
        publisher.off('*', onPublisherEvent)
        window.location.href = '/'
      })
      watchContext.methods.untrackBitrate(bitrateTrackingTicket)
    } catch (error) {
      console.log(error)
      window.location.href = '/'
    }
  }

  return (
    <>
      <Typography component="h5" variant="h5" textAlign="center" margin={3}>
        Create a New Party!
      </Typography>
      {!isPublished && !isPublishing && (
        <>
          <VideoPreview room={roomContext?.room} onJoinRoom={createEvent} />
          <Box display="none">
            <CurrentStreamVideo elementId={elementId} />
          </Box>
        </>
      )}
      {!isPublished && isPublishing && <Loading />}
      {isPublished && (
        <>
          {console.log('aca main video')}
          <Box display="flex">
            <Box width="75%">
              <MainVideo />
            </Box>
            <Box width="25%">
              <SubscribersPanelList />
            </Box>
            <Box className={classes.hangOff}>
              <PhoneDisabledIcon fontSize="large" onClick={hangOff} />
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Publisher
