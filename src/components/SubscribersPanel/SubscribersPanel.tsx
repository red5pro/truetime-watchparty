import { Box, CardContent } from '@mui/material'
import * as React from 'react'
import RoomContext from '../RoomContext/RoomContext'
import useVideoStyles from './SubscribersPanel.module'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

interface ISubscribersPanelProps {
  isPublisher?: boolean
}

const SubscribersPanel = ({ isPublisher }: ISubscribersPanelProps) => {
  const { classes } = useVideoStyles()
  const roomContext = React.useContext(RoomContext.Context)
  const videoRef = React.useRef(null)
  const [cameraOn, setCameraOn] = React.useState<boolean>(true)
  const [micOn, setMicOn] = React.useState<boolean>(false)

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

  const toggleCamera = async () => {
    const isCameraOn = !cameraOn
    setCameraOn(isCameraOn)

    const camera = roomContext?.cameraSelected as any
    if (isCameraOn) {
      camera.enabled = true
    } else {
      camera.enabled = false
    }
  }

  const toggleMic = () => {
    const isMicOn = !micOn
    setMicOn(isMicOn)

    const microphone = roomContext?.microphoneSelected as any

    if (isMicOn) {
      microphone.enabled = true
    } else {
      microphone.enabled = false
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
      {isPublisher && (
        <Box display="flex" justifyContent="flex-end" className={classes.mediaControlsContainer}>
          <Box component="div" onClick={toggleCamera}>
            {cameraOn ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}
          </Box>
          <Box component="div" onClick={toggleMic}>
            {micOn ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
          </Box>
        </Box>
      )}
    </CardContent>
  )
}

export default SubscribersPanel
