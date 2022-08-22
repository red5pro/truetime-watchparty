import React from 'react'
import { Button, Stack } from '@mui/material'
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'

interface PublisherControlsProps {
  cameraOn: boolean
  microphoneOn: boolean
  onCameraToggle(on: boolean): any
  onMicrophoneToggle(on: boolean): any
}

const PublisherControls = (props: PublisherControlsProps) => {
  const { cameraOn, microphoneOn, onCameraToggle, onMicrophoneToggle } = props

  const [isCameraOn, setIsCameraOn] = React.useState<boolean>(cameraOn)
  const [isMicrophoneOn, setIsMicrophoneOn] = React.useState<boolean>(microphoneOn)

  React.useEffect(() => {
    onCameraToggle(isCameraOn)
  }, [isCameraOn])

  React.useEffect(() => {
    onMicrophoneToggle(isMicrophoneOn)
  }, [isMicrophoneOn])

  const onCamera = () => setIsCameraOn(!isCameraOn)
  const onMicrophone = () => setIsMicrophoneOn(!isMicrophoneOn)

  return (
    <Stack direction="row" padding={2} alignItems="center">
      <Button variant="contained" startIcon={isMicrophoneOn ? <Mic /> : <MicOff />} onClick={onMicrophone}>
        {isMicrophoneOn ? 'Mute' : 'Unmute'}
      </Button>
      <Button variant="contained" startIcon={isCameraOn ? <Videocam /> : <VideocamOff />} onClick={onCamera}>
        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
      </Button>
    </Stack>
  )
}

export default PublisherControls
