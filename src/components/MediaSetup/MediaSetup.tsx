import * as React from 'react'
import { CardContent } from '@mui/material'

import MediaContext from '../MediaContext/MediaContext'
import useMediaStyles from './MediaSetup.module'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'

interface IMediaSetupProps {
  selfCleanup: boolean
}

const MediaSetup = ({ selfCleanup }: IMediaSetupProps) => {
  const mediaContext = React.useContext(MediaContext.Context)

  const videoRef: any = React.useRef(null)
  const { classes } = useMediaStyles()

  const [storedConstraints, setStoredConstraints] = React.useState<any | undefined>()

  React.useEffect(() => {
    if (mediaContext && !mediaContext?.constraints) {
      mediaContext?.setConstraints(storedConstraints || DEFAULT_CONSTRAINTS)
    }
  }, [])

  React.useEffect(() => {
    const video: any = videoRef.current
    if (mediaContext?.mediaStream) {
      const { srcObject } = videoRef
      if (srcObject !== mediaContext?.mediaStream) {
        video.srcObject = mediaContext.mediaStream
      }
    }

    return () => {
      // TODO: This may need to be pushed to parent container
      //        as we may want to maintain the media stream when publishing.
      if (typeof selfCleanup === 'boolean' && selfCleanup) {
        if (video && video.srcObject) {
          video.srcObject.getTracks().forEach((t: MediaStreamTrack) => t.stop())
          mediaContext?.setConstraints(undefined)
          mediaContext?.setMediaStream(undefined)
        }
      }
      video.srcObject = null
    }
  }, [videoRef, mediaContext?.mediaStream])

  return (
    <>
      <p>Setup</p>
      <CardContent className={classes.container}>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls
          autoPlay
          playsInline
          muted
          onContextMenu={() => false}
          className={classes.video}
        />
      </CardContent>
    </>
  )
}

export default MediaSetup
