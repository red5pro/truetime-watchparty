import { Box } from '@mui/material'
import React from 'react'
import { RTCPublisher, RTCSubscriber } from 'red5pro-webrtc-sdk'
import { SERVER_HOST } from '../../settings/variables'

const isSecure = false

const config = {
  protocol: isSecure ? 'wss' : 'ws',
  host: SERVER_HOST,
  port: isSecure ? 443 : 5080,
  app: 'live',
  streamName: 'mystream',
  mediaElementId: 'red5pro-publisher',
  rtcConfiguration: {
    iceServers: [{ urls: 'stun:stun2.l.google.com:19302' }],
    iceCandidatePoolSize: 2,
    bundlePolicy: 'max-bundle',
  }, // See https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
  bandwidth: {
    audio: 56,
    video: 512,
  },
  mediaConstraints: {
    audio: true,
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

const TestSDK = () => {
  const start = async () => {
    debugger
    try {
      const publisher = new RTCPublisher()
      await publisher.init(config)
      await publisher.publish()

      const subscriber = new RTCSubscriber()
      await subscriber.init(config)
      await subscriber.subscribe()
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    start()
  }, [])

  return <Box>Test SDK</Box>
}

export default TestSDK
