import { CardContent } from '@mui/material'
import * as React from 'react'
import useVideoStyles from './VideoElement.module'

interface IMainVideoProps {
  elementId: string
  styles: any
}

const VideoElement = ({ elementId, styles }: IMainVideoProps) => {
  const videoRef: any = React.useRef(null)
  const { classes } = useVideoStyles()

  return (
    <CardContent className={classes.container}>
      <video
        ref={videoRef}
        id={elementId}
        width="100%"
        height="100%"
        controls
        autoPlay
        playsInline
        onContextMenu={() => false}
        className={`${classes.video} ${styles}`}
      />
    </CardContent>
  )
}

export default VideoElement
