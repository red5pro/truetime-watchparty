/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import * as React from 'react'
import { RTCSubscriber, WHEPClient } from 'red5pro-webrtc-sdk'
import VideoElement from '../VideoElement/VideoElement'
import Loading from '../Common/Loading/Loading'
import { Box, Stack } from '@mui/material'
import { MicOff, VideocamOff, AccountBox } from '@mui/icons-material'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'
import { getEdge } from '../../utils/streamManagerUtils'
import useStyles from './Subscriber.module'
import MediaContext from '../MediaContext/MediaContext'

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
  host: string
  streamGuid: string
  useStreamManager: boolean
  preferWhipWhep: boolean
  resubscribe: boolean
  styles: any
  videoStyles: AnalyserOptions | any
  mute: boolean
  showControls: boolean
  isAudioOff?: boolean
  isVideoOff?: boolean
  onSubscribeStart?(): any
  isMainVideo?: boolean
}

const DELAY = 2000
const RETRY_EVENTS = ['Connect.Failure', 'Subscribe.Fail', 'Subscribe.InvalidName', 'Subscribe.Play.Unpublish']

const useMediaContext = () => React.useContext(MediaContext.Context)

const Subscriber = React.forwardRef((props: ISubscriberProps, ref: React.Ref<SubscriberRef>) => {
  const {
    useStreamManager,
    preferWhipWhep,
    resubscribe,
    host,
    streamGuid,
    styles,
    videoStyles,
    mute,
    showControls,
    isAudioOff, // from organizer mute
    isVideoOff, // from organizer mute
    onSubscribeStart,
    isMainVideo,
  } = props

  const mediaContext = useMediaContext()
  const { speakerSelected } = mediaContext ?? { speakerSelected: null }

  React.useImperativeHandle(ref, () => ({ setVolume }))

  const { classes } = useStyles()

  let retryTimeout: any
  let isCancelled: boolean

  const [elementId, setElementId] = React.useState<string>('')
  const [context, setContext] = React.useState<string>('')
  const [streamName, setStreamName] = React.useState<string>('')
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false)
  const [audioOn, setAudioOn] = React.useState<boolean>(!isAudioOff)
  const [videoOn, setVideoOn] = React.useState<boolean>(!isVideoOff)

  const [playbackVolume, setPlaybackVolume] = React.useState<number>(1.0)

  const [subscriber, setSubscriber] = React.useState<any | undefined>()
  const subRef = React.useRef()
  const retryRef = React.useRef()

  React.useEffect(() => {
    const { context, name } = getContextAndNameFromGuid(streamGuid)
    setContext(context)

    if (name) {
      const elemId = `${name}-subscriber-${Math.floor(Math.random() * 0x10000).toString(16)}`
      setElementId(elemId)
      setStreamName(name)
    }

    return () => {
      stopRetry()
      isCancelled = true
      if (subRef.current) {
        console.warn(`[Red5ProSubscriber(${streamName})] - STOP`)
        stop()
      }
    }
  }, [])

  React.useEffect(() => {
    subRef.current = subscriber
  }, [subscriber])

  React.useEffect(() => {
    if (elementId.length > 0 && streamName?.length > 0 && context.length > 0) {
      if (!isSubscribed) {
        start()
      }
    }
  }, [elementId, streamName, context])

  const setVolume = (value: number) => {
    setPlaybackVolume(value)
  }

  const handleMediaActiveFromMode = (mode: string) => {
    console.log(`[Red5ProSubscriber(${streamName})] :: streamingMode=${mode}`)
    switch (mode) {
      case StreamingModes.Audio:
        setAudioOn(true)
        setVideoOn(false)
        break
      case StreamingModes.Video:
        setAudioOn(false)
        setVideoOn(true)
        break
      case StreamingModes.Empty:
        setAudioOn(false)
        setVideoOn(false)
        break
      case StreamingModes.AV:
      default:
        setAudioOn(true)
        setVideoOn(true)
        break
    }
  }

  const onSubscribeEvent = async (event: any) => {
    const { type } = event
    if (type === 'Subscribe.Time.Update' || type === 'Subscribe.Volume.Change') return
    console.log(`[Red5ProSubscriber(${streamName})] :: ${type}`)
    if (RETRY_EVENTS.indexOf(type) > -1) {
      startRetry()
    }
    if (type === 'Subscribe.Metadata') {
      const { streamingMode } = event.data
      handleMediaActiveFromMode(streamingMode)
    } else if (type === 'Subscribe.VideoDimensions.Change') {
      if (onSubscribeStart) {
        onSubscribeStart()
      }
    } else if (type === 'Subscribe.Stop') {
      await stop()
    }
  }

  const start = async () => {
    setIsSubscribing(true)
    try {
      const sub = preferWhipWhep ? new WHEPClient() : new RTCSubscriber()
      const config = {
        app: !preferWhipWhep && useStreamManager ? 'streammanager' : context,
        host: host,
        streamName: streamName,
        mediaElementId: elementId,
        subscriptionId: `${streamName}-${Math.floor(Math.random() * 0x10000).toString(16)}`,
        connectionParams: {
          /* username, password, token? */
        },
        enableChannelSignaling: true, // WHIP/WHEP specific
        trickleIce: true, // Flag to use trickle ice to send candidates
      }
      if (!preferWhipWhep && useStreamManager) {
        const payload = await getEdge(host, context, streamName)
        config.connectionParams = { ...config.connectionParams, host: payload.serverAddress, app: payload.scope }
      }
      sub.on('*', onSubscribeEvent)
      await sub.init(config)
      await sub.subscribe()
      setSubscriber(sub)
      setIsSubscribing(false)
      setIsSubscribed(true)
      console.log(`[Red5ProSubscriber(${streamName})]:: Muted(${mute}).`)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProSubscriber(${streamName})] :: Error in subscribing -  ${jsonError}`)
      console.error(error)
      setIsSubscribed(false)
      setIsSubscribing(false)
      setSubscriber(undefined)

      if (!isMainVideo) {
        startRetry()
      }
    }
  }

  const stop = async () => {
    try {
      if (subRef.current) {
        ;(subRef.current as any).off('*', onSubscribeEvent)
        await (subRef.current as any).unsubscribe()
      }
      setSubscriber(undefined)
    } catch (error: any) {
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProSubscriber(${streamName})] :: Error in unsubscribing -  ${jsonError}`)
      console.error(error)
    }
  }

  const startRetry = () => {
    if (!resubscribe || isCancelled) return
    stopRetry()
    retryTimeout = setTimeout(async () => {
      console.log(`[Red5ProSubscriber${streamName}]:: RETRY...`)
      try {
        await stop()
      } catch (e: any) {
        console.error(e)
      } finally {
        if (!isCancelled) {
          start()
        }
      }
    }, DELAY)
    retryRef.current = retryTimeout
  }

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
      {(!videoOn || isVideoOff) && <AccountBox fontSize="large" className={classes.accountIcon} />}
      <VideoElement
        elementId={elementId}
        muted={mute}
        controls={showControls}
        styles={{ ...videoStyles, display: videoOn ? 'unset' : 'none' }}
        volume={playbackVolume}
        speakerSelected={speakerSelected}
      />
      <Stack direction="row" spacing={1} className={classes.iconBar}>
        {(!audioOn || isAudioOff) && <MicOff />}
        {(!videoOn || isVideoOff) && <VideocamOff />}
      </Stack>
    </Box>
  )
})

Subscriber.displayName = 'Subscriber'
export default Subscriber
