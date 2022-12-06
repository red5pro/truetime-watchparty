import * as React from 'react'
import { RTCSubscriber } from 'red5pro-webrtc-sdk'
import VideoElement from '../VideoElement/VideoElement'
import Loading from '../Common/Loading/Loading'
import { Box, Stack } from '@mui/material'
import { MicOff, VideocamOff, AccountBox } from '@mui/icons-material'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'
import { getEdge } from '../../utils/streamManagerUtils'
import useStyles from './Screenshare.module'

const SimpleAlertDialog = React.lazy(() => import('../Modal/SimpleAlertDialog'))

enum StreamingModes {
  AV = 'Video/Audio',
  Audio = 'Audio',
  Video = 'Video',
  Empty = 'Empty',
}

interface SubscriberRef {
  setVolume(value: number): any
}

interface ISubscriberProps {
  styles: any
  videoStyles: AnalyserOptions | any
}

const ScreenShare = React.forwardRef(function Subscriber(props: ISubscriberProps, ref: React.Ref<SubscriberRef>) {
  const { styles, videoStyles } = props

  React.useImperativeHandle(ref, () => ({ setVolume }))

  const { classes } = useStyles()

  let retryTimeout: any
  let isCancelled: boolean

  const [elementId, setElementId] = React.useState<string>('')
  const [streamName, setStreamName] = React.useState<string>('')
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false)
  const [initScreenShare, setInit] = React.useState<boolean>(false)

  const [playbackVolume, setPlaybackVolume] = React.useState<number>(1.0)

  const videoElem = React.useRef(null)

  const [subscriber, setSubscriber] = React.useState<any | undefined>()
  const [mediaStream, setMediaStream] = React.useState<any | undefined>()
  const [error, setError] = React.useState<any>()

  const subRef = React.useRef()
  const retryRef = React.useRef()

  React.useEffect(() => {
    if (mediaStream) {
      const { id } = mediaStream

      if (id) {
        const elemId = `${id}-publisher-${Math.floor(Math.random() * 0x10000).toString(16)}`
        setElementId(elemId)
        setStreamName(id)
      }
    }

    return () => {
      stopRetry()
      isCancelled = true
      if (subRef.current) {
        console.warn(`[Red5ProSubscriber(${streamName})] - STOP`)
        stop()
      }
    }
  }, [mediaStream])

  React.useEffect(() => {
    subRef.current = subscriber
  }, [subscriber])

  const setVideoMedia = async () => {
    const displayMediaOptions: DisplayMediaStreamConstraints = {
      video: true,
      audio: false,
    }

    let captureStream = null

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      setMediaStream(captureStream)
    } catch (err) {
      console.error(`Error: ${err}`)

      setError({ ...(err as any), title: 'Error on sharing your screen.' })
    }
    return captureStream
  }

  React.useEffect(() => {
    if (elementId.length > 0 && streamName?.length > 0) {
      console.log('ScreenShare - Init screen share')

      setInit(true)
    }
  }, [])

  const setVolume = (value: number) => {
    setPlaybackVolume(value)
  }

  // const start = async () => {
  //   setIsSubscribing(true)
  //   try {
  //     const sub = new RTCSubscriber()
  //     const config = {
  //       app: useStreamManager ? 'streammanager' : context,
  //       host: host,
  //       streamName: streamName,
  //       mediaElementId: elementId,
  //       subscriptionId: `${streamName}-${Math.floor(Math.random() * 0x10000).toString(16)}`,
  //       connectionParams: {
  //         /* username, password, token? */
  //       },
  //     }
  //     if (useStreamManager) {
  //       const payload = await getEdge(host, context, streamName)
  //       config.connectionParams = { ...config.connectionParams, host: payload.serverAddress, app: payload.scope }
  //     }
  //     sub.on('*', onSubscribeEvent)
  //     await sub.init(config)
  //     await sub.subscribe()
  //     setSubscriber(sub)
  //     setIsSubscribing(false)
  //     setIsSubscribed(true)
  //     console.log(`[Red5ProSubscriber(${streamName})]:: Muted(${mute}).`)
  //   } catch (error: any) {
  //     const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
  //     console.error(`[Red5ProSubscriber(${streamName})] :: Error in subscribing -  ${jsonError}`)
  //     console.error(error)
  //     setIsSubscribed(false)
  //     setIsSubscribing(false)
  //     setSubscriber(undefined)

  //     if (!isMainVideo) {
  //       startRetry()
  //     }
  //   }
  // }

  // const stop = async () => {
  //   try {
  //     if (subRef.current) {
  //       ;(subRef.current as any).off('*', onSubscribeEvent)
  //       await (subRef.current as any).unsubscribe()
  //     }
  //     setSubscriber(undefined)
  //   } catch (error: any) {
  //     const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
  //     console.error(`[Red5ProSubscriber(${streamName})] :: Error in unsubscribing -  ${jsonError}`)
  //     console.error(error)
  //   }
  // }

  // const startRetry = () => {
  //   if (!resubscribe || isCancelled) return
  //   stopRetry()
  //   retryTimeout = setTimeout(async () => {
  //     console.log(`[Red5ProSubscriber${streamName}]:: RETRY...`)
  //     try {
  //       await stop()
  //     } catch (e: any) {
  //       console.error(e)
  //     } finally {
  //       if (!isCancelled) {
  //         start()
  //       }
  //     }
  //   }, DELAY)
  //   retryRef.current = retryTimeout
  // }

  const stopRetry = () => {
    if (retryRef.current) {
      clearTimeout(retryRef.current)
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout)
    }
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!initScreenShare && <AccountBox fontSize="large" className={classes.accountIcon} />}
      <VideoElement
        elementId={elementId}
        muted={true}
        controls={false}
        styles={{ ...videoStyles }}
        initScreenShare
        setVideoMedia={setVideoMedia}
      />
      {error && (
        <SimpleAlertDialog
          title={error.title || 'Error'}
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="OK"
          onConfirm={() => setError(undefined)}
        />
      )}
    </Box>
  )
})

export default ScreenShare
