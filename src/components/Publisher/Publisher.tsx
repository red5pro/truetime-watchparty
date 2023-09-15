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
import { setLogLevel, RTCPublisher, WHIPClient, RTCPublisherEventTypes } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import Loading from '../Common/Loading/Loading'
import VideoElement from '../VideoElement/VideoElement'
import { Box, Stack, Typography } from '@mui/material'
import { MicOff, VideocamOff, AccountBox } from '@mui/icons-material'
import { getContextAndNameFromGuid } from '../../utils/commonUtils'
import useStyles from './Publisher.module'
import { getOrigin } from '../../utils/streamManagerUtils'
import { ENABLE_DEBUG_UTILS } from '../../settings/variables'
import { PublisherPost, PublisherRef } from '.'
import { ParticipantMuteState } from '../../models/Participant'

const getSenderFromConnection = (connection: RTCPeerConnection, type: string) => {
  return connection.getSenders().find((s: RTCRtpSender) => s.track?.kind === type)
}

const activateMedia = (sender: RTCRtpSender, active: boolean) => {
  const params = sender.getParameters()
  const encodings = params.encodings
  if (encodings && encodings.length > 0) {
    params.encodings[0].active = active
    sender.setParameters(params)
  }
}

const publisherReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ELEMENT_UPDATE':
      return { ...state, id: action.id, context: action.context, streamName: action.name }
  }
}

interface PublisherProps {
  useStreamManager: boolean
  preferWhipWhep: boolean
  stream?: MediaStream
  host: string
  streamGuid: string
  muteState?: ParticipantMuteState
  styles: any
  disableFlip?: boolean
  onStart(): any
  onInterrupt(): any
  onFail(): any
}

const Publisher = React.forwardRef((props: PublisherProps, ref: React.Ref<PublisherRef>) => {
  const {
    useStreamManager,
    preferWhipWhep,
    stream,
    host,
    streamGuid,
    muteState,
    styles,
    disableFlip,
    onStart,
    onInterrupt,
    onFail,
  } = props
  const { classes } = useStyles()

  React.useImperativeHandle(ref, () => ({ shutdown, send, toggleCamera, toggleMicrophone }))

  const [elementId, setElementId] = React.useState<string | undefined>()
  const [isPublished, setIsPublished] = React.useState<boolean>(false)
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false)
  const [micOn, setMicOn] = React.useState<boolean>(true)
  const [cameraOn, setCameraOn] = React.useState<boolean>(true)

  const [publisher, setPublisher] = React.useState<any>()
  const pubRef = React.useRef()

  const [element, dispatch] = React.useReducer(publisherReducer, {
    id: undefined,
    context: undefined,
    streamName: undefined,
  })

  React.useEffect(() => {
    setLogLevel(ENABLE_DEBUG_UTILS ? 'debug' : 'info')

    return () => {
      //      stopRetry()
      if (pubRef.current) {
        console.warn(`[Red5ProPublisher(${element.streamName})] - STOP`)
        stop()
      }
    }
  }, [])

  React.useEffect(() => {
    const { context, name } = getContextAndNameFromGuid(streamGuid)
    const id = `${name}-publisher`
    if (!isPublished && name) {
      dispatch({ type: 'ELEMENT_UPDATE', id, context, name })
      setElementId(id)
    }
  }, [streamGuid])

  React.useEffect(() => {
    pubRef.current = publisher
  }, [publisher])

  React.useEffect(() => {
    const { context, name } = getContextAndNameFromGuid(streamGuid)
    if (elementId && context && name) {
      if (!isPublished) {
        start(elementId, context, name)
      }
    }
  }, [elementId])

  React.useEffect(() => {
    if (muteState) {
      toggleCamera(!muteState.videoMuted)
      toggleMicrophone(!muteState.audioMuted)
    }
  }, [muteState])

  const onPublisherEvent = (event: any) => {
    const { streamName } = element
    console.log(`[Red5ProPublisher(${streamName})]: PublisherEvent - ${event.type}.`)
    // if (event.type === 'WebSocket.Message.Unhandled') {
    //   console.log(event)
    // }
    const { type } = event
    if (type === 'Publish.Available' || type === 'Publish.Start') {
      onStart()
    } else if (type === 'Publisher.Connection.Closed') {
      // Unexpected close.
      onInterrupt()
    } else if (type === 'Connect.Failure') {
      // Cannot establish connection.
      onFail()
    }
  }

  const start = async (id: string | undefined, context: string, streamName: string) => {
    setIsPublishing(true)
    const pub = preferWhipWhep ? new WHIPClient() : new RTCPublisher()
    try {
      const config = {
        app: !preferWhipWhep && useStreamManager ? 'streammanager' : context,
        host: host,
        streamName: streamName,
        mediaElementId: id,
        clearMediaOnUnpublish: true,
        connectionParams: {
          /* username, password, token? */
        },
        enableChannelSignaling: true, // WHIP/WHEP specific
        trickleIce: true, // Flag to use trickle ice to send candidates
      }
      if (!preferWhipWhep && useStreamManager) {
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
      pub.off('*', onPublisherEvent)
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
        const media = (pubRef.current as any).getMediaStream()
        if (media) {
          media.getTracks().forEach((t: MediaStreamTrack) => t.stop())
        }
        ;(pubRef.current as any).off('*', onPublisherEvent)
        await (pubRef.current as any).unpublish()
      }
      setPublisher(undefined)
    } catch (error: any) {
      const { streamName } = element
      const jsonError = typeof error === 'string' ? error : JSON.stringify(error, null, 2)
      console.error(`[Red5ProPublisher(${streamName})] :: Error in unpublishing -  ${jsonError}`)
      console.error(error)
      // startRetry()
    }
  }

  const shutdown = async () => {
    await stop()
  }

  const send = (post: PublisherPost) => {
    if (pubRef.current) {
      const { messageType, message } = post
      ;(pubRef.current as any).send(messageType, typeof post === 'string' ? { message } : message)
    }
  }

  const toggleCamera = (on: boolean) => {
    if (cameraOn === on) return
    if (pubRef && pubRef.current) {
      const connection = (pubRef.current as any).getPeerConnection()
      const sender = getSenderFromConnection(connection, 'video')
      if (on) {
        ;(pubRef.current as any).unmuteVideo()
        if (sender) activateMedia(sender, true)
      } else {
        ;(pubRef.current as any).muteVideo()
        if (sender) activateMedia(sender, false)
      }
    }
    setCameraOn(on)
  }

  const toggleMicrophone = (on: boolean) => {
    if (micOn === on) return
    if (pubRef && pubRef.current) {
      const connection = (pubRef.current as any).getPeerConnection()
      const sender = getSenderFromConnection(connection, 'audio')
      if (on) {
        ;(pubRef.current as any).unmuteAudio()
        if (sender) activateMedia(sender, true)
      } else {
        ;(pubRef.current as any).muteAudio()
        if (sender) activateMedia(sender, false)
      }
    }
    setMicOn(on)
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!isPublished && (
        <Box className={classes.loading}>
          <Loading />
        </Box>
      )}
      {!cameraOn && <AccountBox fontSize="large" className={classes.accountIcon} />}
      {elementId && (
        <VideoElement
          elementId={elementId}
          muted={true}
          controls={false}
          styles={{ ...styles, transform: disableFlip ? 'unset' : 'scaleX(-1)', display: cameraOn ? 'unset' : 'none' }}
        />
      )}
      <Stack direction="row" spacing={1} className={classes.iconBar}>
        {!micOn && <MicOff />}
        {!cameraOn && <VideocamOff />}
      </Stack>
    </Box>
  )
})

Publisher.displayName = 'Publisher'
export default Publisher
