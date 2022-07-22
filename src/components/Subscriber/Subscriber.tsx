import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import RoomContext from '../RoomContext/RoomContext'
import MainVideo from '../MainVideo/MainVideo'
import Loading from '../Loading/Loading'
import { Box, Typography } from '@mui/material'
import SubscribersPanel from '../SubscribersPanel/SubscribersPanel'
import { SERVER_HOST } from '../../settings/variables'

interface ISubscriberProps {
  room: string
}

const Subscriber = (props: ISubscriberProps) => {
  const { room } = props

  const [elementId, setElementId] = React.useState<string>('')
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false)

  const roomContext = React.useContext(RoomContext.Context)

  const joinRoom = async (values: IRoomFormValues) => {
    const streamNameField = values.name ?? `publisher-${Math.floor(Math.random() * 0x10000).toString(16)}`
    roomContext?.setCurrentStreamName(streamNameField)

    const elemId = `${streamNameField}-subscriber`
    setElementId(elemId)

    const subscriber = new RTCSubscriber()

    setIsSubscribing(true)
    try {
      await subscriber.init({
        app: 'live',
        port: 443,
        protocol: 'wss',
        host: SERVER_HOST,
        streamName: roomContext?.streamName,
        rtcConfiguration: {
          iceServers: [{ urls: 'stun:stun2.l.google.com:19302' }],
          iceCandidatePoolSize: 2,
          bundlePolicy: 'max-bundle',
        },
        mediaElementId: elemId,
        subscriptionId: `${streamNameField}-${Math.floor(Math.random() * 0x10000).toString(16)}`,
      })
      await subscriber.subscribe()

      setIsSubscribing(false)
      setIsSubscribed(true)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProSubscriber] :: Error in subscribing - ' + jsonError)
      console.error(error)
    }
  }

  return (
    <>
      <Typography component="h5" variant="h5" textAlign="center" margin={3}>
        Join the Party!
      </Typography>
      {!isSubscribed && !isSubscribing && <VideoPreview room={room} onJoinRoom={joinRoom} />}
      {isSubscribing && <Loading />}
      <Box display={isSubscribed ? 'flex' : 'none'}>
        <Box width="75%">
          <MainVideo elementId={elementId} />
        </Box>
        <Box width="25%">
          <SubscribersPanel />
        </Box>
      </Box>
    </>
  )
}

export default Subscriber
