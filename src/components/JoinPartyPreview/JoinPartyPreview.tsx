import * as React from 'react'
import { RTCPublisher } from 'red5pro-webrtc-sdk'

import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import CurrentStreamVideo from '../SubscribersPanel/SubscribersPanel'
import { Box } from '@mui/material'
import RoomContext from '../RoomContext/RoomContext'
import { getAuthenticationParams, getConfiguration, getSocketLocationFromProtocol } from '../../utils/publishUtils'
import WatchContext from '../WatchContext/WatchContext'
import { SERVER_HOST } from '../../settings/variables'

interface IJoinPartyPreviewProps {
  setIsPublishing: (Value: boolean) => void
  setIsPublished: (Value: boolean) => void
  setBitrateTrackingTicket: (value: any) => void
  setPublisher: (value: any) => void
  onPublisherEvent: (value: Event) => void
}

const JoinPartyPreview = (props: IJoinPartyPreviewProps) => {
  const { setIsPublished, setIsPublishing, onPublisherEvent, setBitrateTrackingTicket, setPublisher } = props

  const roomContext = React.useContext(RoomContext.Context)
  const watchContext = React.useContext(WatchContext.Context)

  const [elementId, setElementId] = React.useState<string>('')

  React.useEffect(() => {
    const streamNameField = Math.floor(Math.random() * 0x10000).toString(16)
    setElementId(`${streamNameField}-publisher`)
  }, [])

  const createEvent = async (values: IRoomFormValues) => {
    if (roomContext?.mediaStream) {
      roomContext.setRoomName(values.room)
      roomContext.setCurrentStreamName(values.name)

      doPublish(values.room, values.name)
    }
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
    const socketLocation = getSocketLocationFromProtocol()
    const rtcConfig = Object.assign({}, config, {
      protocol: socketLocation.protocol,
      port: socketLocation.port,
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

  const onResolutionUpdate = (frameWidth: number, frameHeight: number) => {
    // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
  }

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

  return (
    <>
      <VideoPreview room={roomContext?.room} onJoinRoom={createEvent} />
      <Box display="none">
        <CurrentStreamVideo elementId={elementId} />
      </Box>
    </>
  )
}

export default JoinPartyPreview
