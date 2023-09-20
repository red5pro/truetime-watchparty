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
import React from 'react'
import useStyles from './Screenshare.module'
import { PublisherRef } from '../Publisher'
import { Box, Typography } from '@mui/material'
import MediaContext from '../MediaContext/MediaContext'
import JoinContext from '../JoinContext/JoinContext'
import Publisher from '../Publisher/Publisher'
import WatchContext from '../WatchContext/WatchContext'

const useMediaContext = () => React.useContext(MediaContext.Context)
const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)

interface ScreenShareRef {
  shutdown(): any
}

interface ScreenShareProps {
  owner: string
  useStreamManager: boolean
  preferWhipWhep: boolean
  host: string
  styles: any
  isSharingScreen: boolean
  onEnded(): any
}

const ScreenSharePublisher = React.forwardRef((props: ScreenShareProps, ref: React.Ref<ScreenShareRef>) => {
  const { owner, useStreamManager, preferWhipWhep, host, styles, isSharingScreen, onEnded } = props
  const { classes } = useStyles()

  const screensharePubRef = React.useRef<PublisherRef>(null)

  const { getSharescreenStreamGuid } = useJoinContext()
  const { startScreenShareMedia, stopScreenShareMedia } = useMediaContext()
  const { shareScreen, shutdownShareScreen } = useWatchContext()

  const [mediaStream, setMediaStream] = React.useState<MediaStream | undefined>()
  const [initScreenShare, setInit] = React.useState<boolean>(false)

  React.useImperativeHandle(ref, () => ({ shutdown }))

  React.useEffect(() => {
    if (isSharingScreen) {
      setInit(true)
    }
  }, [isSharingScreen])

  React.useEffect(() => {
    let s: MediaStream | undefined = undefined
    const start = async () => {
      try {
        const stream = await startScreenShareMedia()
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          onScreenShareEnded()
        })

        setMediaStream(stream)
        s = stream
      } catch (e) {
        onScreenShareEnded()
      }
    }
    if (initScreenShare && !mediaStream) {
      start()
    }
    return () => {
      stopScreenShareMedia(s)
      shutdownShareScreen()
    }
  }, [initScreenShare])

  const shutdown = () => {
    stopScreenShareMedia(mediaStream)
    shutdownShareScreen()
  }

  const onStart = () => {
    // Send notification to all subscribers about the new screenshare and who "owns" it.
    const response = shareScreen(getSharescreenStreamGuid())
  }

  const onFail = () => {
    // TODO: Alert.
    onScreenShareEnded()
  }

  const onInterrupt = () => {
    // TODO: Alert.
    onScreenShareEnded()
  }

  const onScreenShareEnded = () => {
    try {
      shutdown()
      setMediaStream(undefined)
    } catch (e) {
      console.warn(e)
    } finally {
      onEnded()
    }
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!mediaStream && <Typography>Starting...</Typography>}
      {mediaStream && (
        <Publisher
          key="screenshare"
          ref={screensharePubRef}
          host={host}
          disableFlip={true}
          styles={{
            height: '100%',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            transform: 'none !import',
            aspectRatio: 'unset',
          }}
          useStreamManager={useStreamManager}
          preferWhipWhep={preferWhipWhep}
          stream={mediaStream}
          streamGuid={getSharescreenStreamGuid()}
          onStart={onStart}
          onFail={onFail}
          onInterrupt={onInterrupt}
        />
      )}
    </Box>
  )
})

ScreenSharePublisher.displayName = 'ScreenSharePublisher'
export default ScreenSharePublisher
