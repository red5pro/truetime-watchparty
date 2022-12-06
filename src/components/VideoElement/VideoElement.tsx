import { Box } from '@mui/material'
import * as React from 'react'
import useVideoStyles from './VideoElement.module'

interface IVideoElementProps {
  elementId: string
  styles: any
  muted: boolean
  controls: boolean
  volume?: number
  setVideoMedia?: () => Promise<any>
  initScreenShare?: boolean
}

const VideoElement = ({
  elementId,
  styles,
  muted,
  controls,
  volume,
  setVideoMedia,
  initScreenShare,
}: IVideoElementProps) => {
  const videoRef: any = React.useRef(null)
  const { classes } = useVideoStyles()

  React.useEffect(() => {
    if (typeof volume === 'number' && videoRef && videoRef.current) {
      videoRef.current.volume = volume
      if (volume > 0) {
        videoRef.current.muted = false
      }
    }
  }, [volume])

  React.useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted, elementId])

  const setScreenShare = async () => {
    console.log('setting screen share')
    console.log({ videoRef, initScreenShare, setVideoMedia })
    if (videoRef && videoRef.current && initScreenShare && setVideoMedia) {
      videoRef.current.srcObject = await setVideoMedia()
    }
  }

  React.useEffect(() => {
    setScreenShare()
  }, [initScreenShare])

  return (
    <Box className={classes.container}>
      <video
        ref={videoRef}
        id={elementId}
        width="100%"
        height="100%"
        muted={muted}
        controls={controls}
        autoPlay
        playsInline
        onContextMenu={() => false}
        style={styles}
        className={`${classes.video}`}
      />
    </Box>
  )
}

export default VideoElement
