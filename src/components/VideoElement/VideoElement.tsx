import { Box } from '@mui/material'
import * as React from 'react'
import useVideoStyles from './VideoElement.module'

interface IVideoElementProps {
  elementId: string
  styles: any
}

const VideoElement = ({ elementId, styles }: IVideoElementProps) => {
  const videoRef: any = React.useRef(null)
  const { classes } = useVideoStyles()

  return (
    <Box className={classes.container}>
      <video
        ref={videoRef}
        id={elementId}
        width="100%"
        height="100%"
        controls
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
