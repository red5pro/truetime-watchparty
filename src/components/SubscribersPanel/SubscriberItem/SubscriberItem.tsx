import { CardContent } from '@mui/material'
import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import { getAuthenticationParams, getConfiguration } from '../../../utils/publishUtils'
import WatchContext from '../../WatchContext/WatchContext'
import useItemStyles from './SubscriberItem.module'
import RoomContext from '../../RoomContext/RoomContext'

interface ISubscriberItemProps {
  name: string
}

const SubscriberItem = ({ name }: ISubscriberItemProps) => {
  const { classes } = useItemStyles()
  const videoRef = React.useRef(null)
  const elemId = `${name}-subscriber}`

  const watchContext = React.useContext(WatchContext.Context)
  const roomContext = React.useContext(RoomContext.Context)

  console.log('StreamName', roomContext?.streamName)

  React.useEffect(() => {
    if (name) {
      setSubscriberItem()
      // setMediaOptions()
    }
  }, [name])

  const setSubscriberItem = async () => {
    const configuration = getConfiguration()
    const authParams = getAuthenticationParams(configuration)

    const baseSubscriberConfig = Object.assign(
      {},
      configuration,
      {
        protocol: watchContext.methods.getSocketLocationFromProtocol().protocol,
        port: watchContext.methods.getSocketLocationFromProtocol().port,
      },
      authParams,
      {
        app: `live`,
      }
    )
    const uid = Math.floor(Math.random() * 0x10000).toString(16)

    const rtcConfig = Object.assign({}, baseSubscriberConfig, {
      streamName: name,
      subscriptionId: `${name}-subscription`, //check if this is correct
      mediaElementId: elemId,
    })

    try {
      const subscriber = new RTCSubscriber()
      subscriber.on('*', (e: Event) => handleEvent(e))

      await subscriber.init(rtcConfig)
      watchContext.methods.addSubscriberMap(subscriber)

      await subscriber.subscribe()
    } catch (error) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProSubscription] :: Error in subs - ' + jsonError)
      console.error(error)
    }
  }

  const handleEvent = (ev: Event) => {
    console.log({ ev })
  }

  return (
    <CardContent className={classes.container}>
      <video
        id={elemId}
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        muted
        playsInline
        loop
        onContextMenu={() => false}
        className={classes.video}
      />
    </CardContent>
  )
}

export default SubscriberItem
