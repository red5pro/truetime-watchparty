import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import { RTCPublisher, RTCPublisherEventTypes } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import { getAuthenticationParams, getConfiguration, getServerSettings } from '../../utils/publishUtils'
import WatchContext from '../WatchContext/WatchContext'
import RoomContext from '../RoomContext/RoomContext'
import Loading from '../Loading/Loading'
import MainVideo from '../MainVideo/MainVideo'
import { Box, Typography } from '@mui/material'
import { SERVER_HOST } from '../../settings/variables'
import SubscribersPanel from '../SubscribersPanel/SubscribersPanel'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import usePublisherStyles from './Publisher.module'

const Publisher = () => {
  const watchContext = React.useContext(WatchContext.Context)
  const roomContext = React.useContext(RoomContext.Context)

  const [elementId, setElementId] = React.useState<string>('')
  const [isPublished, setIsPublished] = React.useState<boolean>(false)
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false)
  const [publisher, setPublisher] = React.useState<any>()

  const { classes } = usePublisherStyles()

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

  const getSocketLocationFromProtocol = () => {
    const settings = getServerSettings()
    const isSecure = window.location.protocol.includes('https')

    return !isSecure
      ? { protocol: 'ws', port: settings?.wsport ?? '' }
      : { protocol: 'wss', port: settings?.wssport ?? '' }
  }

  const processStreams = (list: any[], previousList: any, roomName: string, exclusion: string) => {
    const nonPublishers = list.filter((name: string) => {
      return name !== exclusion
    })

    const [existing, toAdd, toRemove] = nonPublishers.filter((name: string, index: number, self: any[]) => {
      const existing = self.indexOf(name) && previousList.indexOf(name) !== -1
      const toAdd = self.indexOf(name) && previousList.indexOf(name) === -1
      const toRemove = self.indexOf(name) && list.indexOf(name) === -1

      return [existing, toAdd, toRemove]
    })

    watchContext.removeSubscribers(toRemove)
    const configuration = getConfiguration()
    const authParams = getAuthenticationParams(configuration)

    // positionExisting(existing)
    // let lastIndex = existing.length
    // const subscribers = toAdd.map((name: string, index: number) => {
    //   // const parent = lastIndex++ < bottomRowLimit ? bottomSubscribersEl : sideSubscribersEl
    //   return new window.ConferenceSubscriberItem(name, parent, index, relayout)
    // })
    // relayout()

    const baseSubscriberConfig = Object.assign(
      {},
      configuration,
      {
        protocol: getSocketLocationFromProtocol().protocol,
        port: getSocketLocationFromProtocol().port,
      },
      authParams,
      {
        app: `live/${roomName}`,
      }
    )

    // if (subscribers.length > 0) {
    //   //subscribers[0].execute(baseSubscriberConfig)
    //   subscribers.forEach((sub) => {
    //     sub.execute(baseSubscriberConfig)
    //   })
    // }
  }

  const establishSocketHost = (roomName: string) => {
    const { streamsList, hostSocket, setHostSocket } = watchContext
    const streamName = roomContext?.streamName ?? ''

    if (hostSocket) return

    const isSecure = window.location.protocol.includes('https')
    const wsProtocol = isSecure ? 'wss' : 'ws'

    // hacked to support remote server while doing local development
    const url = `${wsProtocol}://${SERVER_HOST}:8443?room=${roomName}&streamName=${streamName}`
    const newHostSocket = new WebSocket(url)

    newHostSocket.onmessage = function (message) {
      const payload = JSON.parse(message.data)
      if (roomName === payload.room) {
        processStreams(payload.streams, streamsList, roomName, streamName)
      }
    }

    setHostSocket(newHostSocket)
  }

  const onResolutionUpdate = (frameWidth: number, frameHeight: number) => {
    // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
  }

  const onPublishSuccess = (publisher: any, roomName: string) => {
    setPublisher(publisher)

    if (publisher.getType().toUpperCase() !== 'RTC') {
      establishSocketHost(roomName)
    }
    try {
      const connection = publisher.getPeerConnection()
      const senders = connection.getSenders()
      const sender = senders.find((s: RTCRtpSender) => s.track && s.track.kind === 'video')
      const broadcastTrack = sender.track.clone()
      broadcastTrack.enabled = true
      sender.replaceTrack(broadcastTrack)

      const stream = publisher.getMediaStream()
      // bitrateTrackingTicket = window.trackBitrate(pc, onBitrateUpdate, null, null, true)
      stream.getVideoTracks().forEach((track: any) => {
        const settings = track.getSettings()
        onResolutionUpdate(settings.width, settings.height)
      })
    } catch (e) {
      console.log('error', e)
    }
  }

  const determinePublisher = async () => {
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
      protocol: getSocketLocationFromProtocol().protocol,
      port: getSocketLocationFromProtocol().port,
      host: SERVER_HOST,
      bandwidth: {
        video: 256,
      },
      app: `live`,
      streamName: roomContext?.streamName ?? '',
    })

    const publisher = new RTCPublisher()
    const publisherInit = await publisher.init(rtcConfig)

    return publisherInit
  }

  const onPublisherEvent = (event: any) => {
    console.log('[Red5ProPublisher]: PublisherEvent ' + event.type + '.')
    if (event.type === 'WebSocket.Message.Unhandled') {
      console.log(event)
    } else if (event.type === RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE) {
      //      window.allowMediaStreamSwap(targetPublisher, targetPublisher.getOptions().mediaConstraints, document.getElementById('red5pro-publisher'));
    } else if (event.type === 'Publisher.Connection.Closed') {
      // notifyOfPublishFailure();
    }
    // updateStatusFromEvent(event);
    return
  }

  const doPublish = async (room: string, name: string) => {
    try {
      const targetPublisher = await determinePublisher()
      targetPublisher.on('*', onPublisherEvent)
      await targetPublisher.publish() // targetPublisher.publish(name)

      onPublishSuccess(targetPublisher, room)

      setIsPublishing(false)
      setIsPublished(true)

      window.history.replaceState(null, '', room)
    } catch (error) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProPublisher] :: Error in publishing - ' + jsonError)
      console.error(error)

      // onPublishFail(jsonError)
    }
  }

  React.useEffect(() => {
    const streamNameField = Math.floor(Math.random() * 0x10000).toString(16)

    setElementId(`${streamNameField}-publisher`)
  }, [])

  const createEvent = async (values: IRoomFormValues) => {
    setIsPublishing(true)

    if (roomContext?.mediaStream) {
      doPublish(values.room, values.name)
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
      {!isPublished && !isPublishing && <VideoPreview room={''} onJoinRoom={createEvent} />}
      {isPublishing && <Loading />}

      <Box display={isPublished ? 'flex' : 'none'}>
        <Box width="75%">
          <MainVideo elementId={elementId} />
        </Box>
        <Box width="25%">
          <SubscribersPanel isPublisher />
        </Box>
        <Box className={classes.hangOff}>
          <PhoneDisabledIcon fontSize="large" onClick={hangOff} />
        </Box>
      </Box>
    </>
  )
}

export default Publisher
