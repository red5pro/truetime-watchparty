import * as React from 'react'
import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import VideoElement from '../VideoElement/VideoElement'
import Loading from '../Loading/Loading'
import { Box } from '@mui/material'
import { SERVER_HOST } from '../../settings/variables'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'
import { getEdge } from '../../utils/streamManagerUtils'
import useStyles from './Subscriber.module'

interface ISubscriberProps {
  host: string
  streamGuid: string
  useStreamManager: boolean
  resubscribe: boolean
  styles: any
}

const DELAY = 2000
const RETRY_EVENTS = ['Connect.Failure', 'Subscribe.Fail', 'Subscribe.InvalidName', 'Subscribe.Play.Unpublish']

const Subscriber = (props: ISubscriberProps) => {
  const { useStreamManager, resubscribe, host, streamGuid, styles } = props

  const { classes } = useStyles()

  console.log('STYLES', styles)

  let retryTimeout: any

  const [elementId, setElementId] = React.useState<string>('')
  const [context, setContext] = React.useState<string>('')
  const [streamName, setStreamName] = React.useState<string>('')
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false)

  const [subscriber, setSubscriber] = React.useState<any | undefined>()

  const [retryId, setRetryId] = React.useState<number>(-1)

  React.useEffect(() => {
    const elemId = `${streamName}-subscriber`
    setElementId(elemId)

    const { context, name } = getContextAndNameFromGuid(streamGuid)
    setContext(context)
    if (name) {
      setStreamName(name)
    }

    return () => {
      stopRetry()
      if (subscriber) {
        stop()
      }
    }
  }, [])

  React.useEffect(() => {
    if (elementId.length > 0 && streamName?.length > 0 && context.length > 0) {
      start()
    }
  }, [elementId, streamName, context])

  const onSubscribeEvent = (event: any) => {
    if (event.type !== 'Subscribe.Time.Update') {
      console.log(`[Red5ProSubscriber(${streamName})] :: ${event.type}`)
      if (RETRY_EVENTS.indexOf(event.type) > -1) {
        startRetry()
      }
    }
  }

  const start = async () => {
    setIsSubscribing(true)
    try {
      const sub = new RTCSubscriber()
      const config = {
        app: useStreamManager ? 'streammanager' : context,
        host: host,
        streamName: streamName,
        mediaElementId: elementId,
        subscriptionId: `${streamName}-${Math.floor(Math.random() * 0x10000).toString(16)}`,
        connectionParams: {
          /* username, password, token? */
        },
      }
      if (useStreamManager) {
        const payload = await getEdge(host, context, streamName)
        config.connectionParams = { ...config.connectionParams, host: payload.serverAddress, app: payload.scope }
      }
      sub.on('*', onSubscribeEvent)
      await sub.init(config)
      await sub.subscribe()
      setSubscriber(sub)
      setIsSubscribing(false)
      setIsSubscribed(true)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProSubscriber(${streamName})] :: Error in subscribing -  ${jsonError}`)
      console.error(error)
      startRetry()
    }
  }

  const stop = async () => {
    try {
      if (subscriber) {
        subscriber.off('*', onSubscribeEvent)
        await subscriber.unsubscribe()
      }
      setSubscriber(undefined)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProSubscriber(${streamName})] :: Error in unsubscribing -  ${jsonError}`)
      console.error(error)
      startRetry()
    }
  }

  const startRetry = () => {
    if (!resubscribe) return
    stopRetry()
    retryTimeout = setTimeout(async () => {
      console.log(`[Red5ProSubscriber${streamName}]:: RETRY...`)
      try {
        await stop()
      } catch (e: any) {
        console.error(e)
      } finally {
        start()
      }
    }, DELAY)
  }

  const stopRetry = () => {
    if (retryTimeout) {
      clearTimeout(retryTimeout)
    }
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!isSubscribed && (
        <Box className={classes.loading}>
          <Loading />
        </Box>
      )}
      {(isSubscribing || isSubscribed) && <VideoElement elementId={elementId} styles={styles || {}} />}
    </Box>
  )
}

export default Subscriber
