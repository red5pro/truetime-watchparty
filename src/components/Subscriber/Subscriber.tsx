import * as React from 'react'
import VideoPreview, { IRoomFormValues } from '../VideoPreview/VideoPreview'
import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import VideoElement from '../VideoElement/VideoElement'
import Loading from '../Loading/Loading'
import { Box } from '@mui/material'
import { SERVER_HOST } from '../../settings/variables'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'

interface ISubscriberProps {
  host: string
  streamGuid: string
  useStreamManager: boolean
  styles: any
}

const Subscriber = (props: ISubscriberProps) => {
  const { useStreamManager, host, streamGuid, styles } = props

  const [elementId, setElementId] = React.useState<string>('')
  const [context, setContext] = React.useState<string>('')
  const [streamName, setStreamName] = React.useState<string>('')
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false)

  const [subscriber, setSubscriber] = React.useState<any | undefined>()

  React.useEffect(() => {
    const elemId = `${streamName}-subscriber`
    setElementId(elemId)

    const { context, name } = getContextAndNameFromGuid(streamGuid)
    setContext(context)
    if (name) {
      setStreamName(name)
    }

    return () => {
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
      }
      await sub.init(config)
      await sub.subscribe()
      setSubscriber(sub)
      setIsSubscribing(false)
      setIsSubscribed(true)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProSubscriber(${streamName})] :: Error in subscribing -  ${jsonError}`)
      console.error(error)
    }
  }

  return (
    <Box>
      {!isSubscribed && <Loading />}
      {(isSubscribing || isSubscribed) && <VideoElement elementId={elementId} styles={styles || {}} />}
    </Box>
  )
}

export default Subscriber
