import { RTCPublisher, RTCPublisherEventTypes } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import Loading from '../Loading/Loading'
import VideoElement from '../VideoElement/VideoElement'
import { Box, Typography } from '@mui/material'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'
import useStyles from './Publisher.module'
import { getOrigin } from '../../utils/streamManagerUtils'

interface PublisherProps {
  useStreamManager: boolean
  stream: MediaStream
  host: string
  streamGuid: string
  styles: any
  onStart(): any
  onInterrupt(): any
  onFail(): any
}

const Publisher = (props: PublisherProps) => {
  const { useStreamManager, stream, host, streamGuid, styles, onStart, onInterrupt, onFail } = props
  const { classes } = useStyles()

  const [elementId, setElementId] = React.useState<string>('')
  const [context, setContext] = React.useState<string>('')
  const [streamName, setStreamName] = React.useState<string>('')
  const [isPublished, setIsPublished] = React.useState<boolean>(false)
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false)
  const [publisher, setPublisher] = React.useState<any>()

  const pubRef = React.useRef()

  React.useEffect(() => {
    const { context, name } = getContextAndNameFromGuid(streamGuid)
    setContext(context)

    if (name) {
      const elemId = `${name}-publisher`
      setElementId(elemId)
      setStreamName(name)
    }

    return () => {
      //      stopRetry()
      if (pubRef.current) {
        console.warn(`[Red5ProPublisher(${streamName})] - OUT`)
        stop()
      }
    }
  }, [])

  React.useEffect(() => {
    console.log('PUBLISHER', publisher)
    pubRef.current = publisher
  }, [publisher])

  React.useEffect(() => {
    if (elementId.length > 0 && streamName?.length > 0 && context.length > 0) {
      if (!isPublished) {
        start()
      }
    }
  }, [elementId, streamName, context])

  const onPublisherEvent = (event: any) => {
    console.log(`[Red5ProPublisher(${streamName})]: PublisherEvent - ${event.type}.`)
    // if (event.type === 'WebSocket.Message.Unhandled') {
    //   console.log(event)
    // } else if (event.type === RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE) {
    // } else if (event.type === 'Publisher.Connection.Closed') {
    // }
    // TODO: Handle events for onStart and onInterrupt
    if (event.type === 'Publish.Available') {
      onStart()
    }
  }

  const start = async () => {
    setIsPublishing(true)
    try {
      const pub = new RTCPublisher()
      const config = {
        app: useStreamManager ? 'streammanager' : context,
        host: host,
        streamName: streamName,
        mediaElementId: elementId,
        clearMediaOnUnpublish: true,
        connectionParams: {
          /* username, password, token? */
        },
      }
      if (useStreamManager) {
        const payload = await getOrigin(host, context, streamName)
        config.connectionParams = { ...config.connectionParams, host: payload.serverAddress, app: payload.scope }
      }
      pub.on('*', onPublisherEvent)
      await pub.initWithStream(config, stream)
      await pub.publish()
      setPublisher(pub)
      setIsPublishing(false)
      setIsPublished(true)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProPublisher(${streamName})] :: Error in publishing -  ${jsonError}`)
      console.error(error)
      setIsPublishing(false)
      setIsPublished(false)
      setPublisher(undefined)
      onFail()
      //      startRetry()
    }
  }

  const stop = async () => {
    try {
      if (pubRef.current) {
        ;(pubRef.current as any).off('*', onPublisherEvent)
        await (pubRef.current as any).unpublish()
      }
      setPublisher(undefined)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProPublisher(${streamName})] :: Error in unpublishing -  ${jsonError}`)
      console.error(error)
      // startRetry()
    }
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!isPublished && (
        <Box className={classes.loading}>
          <Loading />
        </Box>
      )}
      <VideoElement elementId={elementId} muted={true} controls={false} styles={styles} />
    </Box>
  )
}

export default Publisher
