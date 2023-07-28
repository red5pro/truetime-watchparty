import React from 'react'
import { Stack } from '@mui/material'
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import useStyles from './PublisherControls.module'
import { ParticipantMuteState } from '../../models/Participant'

interface PublisherControlsProps {
  cameraOn: boolean
  microphoneOn: boolean
  muteState?: ParticipantMuteState
  onCameraToggle(on: boolean): any
  onMicrophoneToggle(on: boolean): any
}

const PublisherControls = (props: PublisherControlsProps) => {
  const { cameraOn, microphoneOn, muteState, onCameraToggle, onMicrophoneToggle } = props

  const [isCameraOn, setIsCameraOn] = React.useState<boolean>(cameraOn)
  const [isMicrophoneOn, setIsMicrophoneOn] = React.useState<boolean>(microphoneOn)

  const { classes } = useStyles()

  React.useEffect(() => {
    onCameraToggle(isCameraOn)
  }, [isCameraOn])

  React.useEffect(() => {
    onMicrophoneToggle(isMicrophoneOn)
  }, [isMicrophoneOn])

  React.useEffect(() => {
    if (muteState) {
      setIsCameraOn(!muteState.videoMuted)
      setIsMicrophoneOn(!muteState.audioMuted)
    }
  }, [muteState])

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
        className={classes.button}
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
