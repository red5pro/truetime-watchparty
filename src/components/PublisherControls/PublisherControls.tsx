import React from 'react'
import { Button, Stack } from '@mui/material'
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'

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
    <Stack direction="row" padding={2} alignItems="center" sx={{ padding: '0' }}>
      <CustomButton
        size={BUTTONSIZE.SMALL}
        buttonType={BUTTONTYPE.TRANSPARENT}
        startIcon={isMicrophoneOn ? <Mic /> : <MicOff sx={{ color: 'rgb(195, 62, 58)' }} />}
        onClick={onMicrophone}
      >
        {isMicrophoneOn ? 'Mute' : 'Unmute'}
      </CustomButton>
      <CustomButton
        size={BUTTONSIZE.SMALL}
        buttonType={BUTTONTYPE.TRANSPARENT}
        startIcon={
          isCameraOn ? (
            <Videocam sx={{ color: 'rgb(156, 243, 97)' }} />
          ) : (
            <VideocamOff sx={{ color: 'rgb(156, 243, 97)' }} />
          )
        }
        onClick={onCamera}
      >
        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
      </CustomButton>
    </Stack>
  )
}

export default PublisherControls
