import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import { RTCPublisher } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import { getAuthenticationParams, getConfiguration, getServerSettings } from '../../utils/publishUtils'
import RoomContext from '../RoomContext/RoomContext'
import WatchContext from '../WatchContext/WatchContext'

interface IPublisherProps {
  room: string
  setRoom: (room: string) => void
  setStream: (stream: string) => void
}

const Publisher = (props: IPublisherProps) => {
  const { room, setRoom, setStream } = props

  const roomContext = React.useContext(RoomContext.Context)
  const watchContext = React.useContext(WatchContext.Context)

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

  const positionExisting = (list: string[]) => {
    list.forEach((name, index) => {
      // TODO need to know what is this for
      console.log({ name, index })

      // const elementContainer = document.getElementById(
      //   window.getConferenceSubscriberElementContainerId(name),
      // );
      // if (elementContainer && index < bottomRowLimit) {
      //   if (
      //     elementContainer.parentNode &&
      //     elementContainer.parentNode !== bottomSubscribersEl
      //   ) {
      //     elementContainer.parentNode.removeChild(elementContainer);
      //     bottomSubscribersEl.appendChild(elementContainer);
      //   }
      // } else if (elementContainer) {
      //   if (
      //     elementContainer.parentNode &&
      //     elementContainer.parentNode !== sideSubscribersEl
      //   ) {
      //     elementContainer.parentNode.removeChild(elementContainer);
      //     sideSubscribersEl.appendChild(elementContainer);
      //   }
      // }
    })
  }

  const relayout = () => console.log('relayout')

  const processStreams = (list: any[], previousList: any, roomName: string, exclusion: string) => {
    console.log('TEST', `To streams: ${list}`)

    const nonPublishers = list.filter((name: string) => {
      return name !== exclusion
    })

    const [existing, toAdd, toRemove] = nonPublishers.filter((name: string, index: number, self: any[]) => {
      const existing = self.indexOf(name) && previousList.indexOf(name) !== -1
      const toAdd = self.indexOf(name) && previousList.indexOf(name) === -1
      const toRemove = self.indexOf(name) && list.indexOf(name) === -1

      return [existing, toAdd, toRemove]
    })

    console.log('TEST', `To add: ${toAdd}`)
    console.log('TEST', `To remove: ${toRemove}`)

    roomContext.removeSubscribers(toRemove)
    const configuration = getConfiguration()
    const authParams = getAuthenticationParams(configuration)

    positionExisting(existing)
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

  const establishSocketHost = (publisher: any, roomName: string, streamName: string) => {
    //if (hostSocket) return

    const isSecure = window.location.protocol.includes('https')
    const wsProtocol = isSecure ? 'wss' : 'ws'
    const host = location.host
    // const url = `${wsProtocol}://${socketEndpoint}:8001?room=${roomName}&streamName=${streamName}`
    // hacked to support remote server while doing local development

    const url = `${wsProtocol}://${host}:8443?room=${roomName}&streamName=${streamName}`
    const hostSocket = new WebSocket(url)
    const { streamsList } = watchContext
    hostSocket.onmessage = function (message) {
      const payload = JSON.parse(message.data)
      if (roomName === payload.room) {
        processStreams(payload.streams, streamsList, roomName, streamName)
      }
    }
  }

  const onResolutionUpdate = (frameWidth: number, frameHeight: number) => {
    // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
  }

  const onPublishSuccess = (publisher: any, roomName: string, streamName: string) => {
    const isPublishing = true

    console.log('[Red5ProPublisher] Publish Complete.')
    //here remove hidden main video
    //establishSharedObject(publisher, roomField.value, streamNameField.value)
    if (publisher.getType().toUpperCase() !== 'RTC') {
      establishSocketHost(publisher, roomName, streamName)
    }
    try {
      const pc = publisher.getPeerConnection()
      const stream = publisher.getMediaStream()
      // bitrateTrackingTicket = window.trackBitrate(pc, onBitrateUpdate, null, null, true)
      //statisticsField.classList.remove('hidden')
      // mainProgram.classList.remove('hidden')
      stream.getVideoTracks().forEach((track: any) => {
        const settings = track.getSettings()
        onResolutionUpdate(settings.width, settings.height)
      })
    } catch (e) {
      console.log('error', e)
    }
  }

  const determinePublisher = async (mediaStream: MediaStream, room: string, name: string) => {
    const configuration = getConfiguration()
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
      host: location.host,
      bandwidth: {
        video: 256,
      },
      app: `live`,
      streamName: name,
    })

    debugger
    const publisher = new RTCPublisher()
    const publisherInit = await publisher.init(rtcConfig)

    console.log({ publisherInit })
    return publisherInit
  }

  const doPublish = async (room: string, name: string, mediaStream: MediaStream) => {
    try {
      const targetPublisher = await determinePublisher(mediaStream, room, name)
      await targetPublisher.publish()

      onPublishSuccess(targetPublisher, room, name)
      // createMainVideo()
    } catch (error) {
      debugger
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProPublisher] :: Error in publishing - ' + jsonError)
      console.error(error)

      // onPublishFail(jsonError)
    }
  }

  const joinRoom = (values: IRoomFormValues) => {
    debugger
    const streamNameField = values.name ?? `publisher-${Math.floor(Math.random() * 0x10000).toString(16)}`

    setRoom(values.room)
    setStream(streamNameField)

    doPublish(values.room, streamNameField, roomContext.mediaStream)
    // setPublishingUI(streamName);
  }

  return (
    <>
      <VideoPreview room={room} onJoinRoom={joinRoom} />
    </>
  )
}

export default Publisher
