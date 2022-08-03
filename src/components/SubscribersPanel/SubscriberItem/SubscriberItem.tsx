import { CardContent } from '@mui/material'
import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import { getAuthenticationParams, getConfiguration } from '../../../utils/publishUtils'
import WatchContext from '../../WatchContext/WatchContext'
import useItemStyles from './SubscriberItem.module'

interface ISubscriberItemProps {
  room?: string
  name: string
  elementId?: string
  shouldAddToMap?: boolean
}

const SubscriberItem = ({ room, name, elementId, shouldAddToMap }: ISubscriberItemProps) => {
  const { classes } = useItemStyles()
  const videoRef = React.useRef(null)
  const elemId = elementId ?? `${name}-subscriber`

  const watchContext = React.useContext(WatchContext.Context)

  React.useEffect(() => {
    const isAlreadyConnected = watchContext.streamConnected.find((x: string) => x === name)
    if (name && !isAlreadyConnected) {
      setSubscriberItem()
      watchContext.methods.addStreamConnected(name)
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
        // if MainVideo --> 'live'
        app: room ? `live/${room}` : 'live',
      }
    )
    const uid = Math.floor(Math.random() * 0x10000).toString(16)

    const rtcConfig = Object.assign({}, baseSubscriberConfig, {
      streamName: name,
      subscriptionId: `${name}-subscriber-${Math.floor(Math.random() * 0x10000).toString(16)}`,
      mediaElementId: elemId,
    })

    try {
      const subscriber = new RTCSubscriber()
      subscriber.on('*', (e: Event) => handleEvent(e))

      await subscriber.init(rtcConfig)

      if (shouldAddToMap) {
        watchContext.methods.addSubscriberMap(subscriber)
        watchContext.methods.establishSocketHost(room, name)
      }

      await subscriber.subscribe()
    } catch (error) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error('[Red5ProSubscription] :: Error in subs - ' + jsonError)
      console.error(error)
    }
  }

  const handleEvent = (ev: Event) => {
    if (ev.type !== 'Subscribe.Time.Update') {
      // console.log({ ev: ev.type, name: name })
    }
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
