import { CardContent } from '@mui/material'
import * as React from 'react'
import useMainVideoStyles from './MainVideo.module'

interface IMainVideoProps {
  elementId: string
}

const MainVideo = ({ elementId }: IMainVideoProps) => {
  const videoRef: any = React.useRef(null)

  const { classes } = useMainVideoStyles()

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
        className={classes.video}
      />
    </CardContent>
  )
}

export default MainVideo
