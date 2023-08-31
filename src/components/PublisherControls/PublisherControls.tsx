/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
