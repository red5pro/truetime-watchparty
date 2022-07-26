import { CardContent } from '@mui/material'
import * as React from 'react'
import RoomContext from '../RoomContext/RoomContext'
import useVideoStyles from './SubscribersPanel.module'

const SubscribersPanel = () => {
  const { classes } = useVideoStyles()
  const roomContext = React.useContext(RoomContext.Context)
  const videoRef = React.useRef(null)

  React.useEffect(() => {
    setMediaOptions()
  }, [roomContext])

  const setMediaOptions = async () => {
    if (videoRef) {
      const video: any = videoRef.current

      if (video && roomContext?.mediaStream) {
        video.srcObject = roomContext?.mediaStream
        await video.play()
      }
    }
  }

  return (
    <CardContent className={classes.container}>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        muted
        playsInline
        loop
        onContextMenu={() => false}
        className={classes.video}
      />
    </CardContent>
  )
}

export default SubscribersPanel
