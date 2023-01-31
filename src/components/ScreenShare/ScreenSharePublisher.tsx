import React from 'react'
import useStyles from './Screenshare.module'
import { PublisherPost, PublisherRef } from '../Publisher'
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
  host: string
  styles: any
  isSharingScreen: boolean
  onEnded(): any
}

const ScreenSharePublisher = React.forwardRef((props: ScreenShareProps, ref: React.Ref<ScreenShareRef>) => {
  const { owner, useStreamManager, host, styles, isSharingScreen, onEnded } = props
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
          styles={{
            height: '100%',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            transform: 'none !import',
            aspectRatio: 'unset',
          }}
          useStreamManager={useStreamManager}
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
