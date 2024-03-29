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
import * as React from 'react'
import { Alert, Box, Button, CardContent, MenuItem, Select, Stack, Typography } from '@mui/material'

import MediaContext from '../MediaContext/MediaContext'
import useMediaStyles from './MediaSetup.module'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { getDeviceListing } from '../../utils/deviceSelectorUtil'
import Loading from '../Common/Loading/Loading'
import MediaControl, { MediaControlOption } from '../MediaSetup/MediaControl'
import { Mic, Videocam, Speaker } from '@mui/icons-material'

const useMediaContext = () => React.useContext(MediaContext.Context)

const deviceReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CAMERAS':
      return { ...state, cameras: action.payload }
    case 'MICROPHONES':
      return { ...state, microphones: action.payload }
    case 'SPEAKERS':
      return { ...state, speakers: action.payload }
  }
}

const isEmptyOrDefault = (value: string) => {
  return value === '' || value === 'default'
}

const mediaSelectClasses = {
  root: {},
}

interface IMediaSetupProps {
  selfCleanup: boolean
}

const MediaSetup = ({ selfCleanup }: IMediaSetupProps) => {
  const {
    error,
    loading,
    constraints,
    setConstraints,
    mediaStream,
    setMediaStream,
    cameraSelected,
    setCameraSelected,
    microphoneSelected,
    setMicrophoneSelected,
    setSpeakerSelected,
    speakerSelected,
    permissionsChanged,
    clearPermissionsChanged,
    dismissError,
    retry,
  } = useMediaContext()

  const videoRef: any = React.useRef(null)
  const { classes } = useMediaStyles()

  const [devices, dispatch] = React.useReducer(deviceReducer, { cameras: [], microphones: [], speakers: [] })
  // TODO: store constraints?
  const [storedConstraints, setStoredConstraints] = React.useState<any | undefined>()

  React.useEffect(() => {
    if (!constraints) {
      console.log('LANDING REQUEST -> Get Devices.')
      getDevices()
      setConstraints(storedConstraints || DEFAULT_CONSTRAINTS)
    }
  }, [])

  React.useEffect(() => {
    if (permissionsChanged) {
      console.log('PERMISSIONS CHANGED -> Get Devices.')
      clearPermissionsChanged()
      getDevices()
    }
  }, [permissionsChanged])

  React.useEffect(() => {
    if (mediaStream) {
      console.log('MEDIA STREAM CHANGED -> Get Devices.')
      getDevices(mediaStream)
    }
  }, [mediaStream])

  React.useEffect(() => {
    const video: any = videoRef.current
    if (mediaStream) {
      const { srcObject } = videoRef
      if (srcObject !== mediaStream) {
        video.srcObject = mediaStream
      }
    }

    return () => {
      // TODO: This may need to be pushed to parent container
      //        as we may want to maintain the media stream when publishing.
      if (typeof selfCleanup === 'boolean' && selfCleanup) {
        if (video && video.srcObject) {
          video.srcObject.getTracks().forEach((t: MediaStreamTrack) => t.stop())
          setConstraints(undefined)
          setMediaStream(undefined)
        }
      }
      video.srcObject = null
    }
  }, [videoRef, mediaStream])

  const getDevices = async (stream?: MediaStream) => {
    const [cameras, microphones, speakers] = await getDeviceListing(stream)
    let selectedCamera = cameras.availableDevices.length > 0 ? cameras.availableDevices[0] : undefined
    let selectedMicrophone = microphones.availableDevices.length > 0 ? microphones.availableDevices[0] : undefined
    const selectedSpeaker = speakers.availableDevices.length > 0 ? speakers.availableDevices[0] : undefined
    if (cameras.currentTrack) {
      selectedCamera = cameras.availableDevices.find((d) => d.label === cameras.currentTrack.label)
    }
    if (microphones.currentTrack) {
      selectedMicrophone = microphones.availableDevices.find((d) => d.label === microphones.currentTrack.label)
    }
    if (!isEmptyOrDefault(cameraSelected)) {
      setCameraSelected(selectedCamera?.deviceId)
    }
    if (!isEmptyOrDefault(microphoneSelected)) {
      setMicrophoneSelected(selectedMicrophone?.deviceId)
    }
    setSpeakerSelected(selectedSpeaker?.deviceId)
    dispatch({ type: 'CAMERAS', payload: cameras.availableDevices })
    dispatch({ type: 'MICROPHONES', payload: microphones.availableDevices })
    dispatch({ type: 'SPEAKERS', payload: speakers.availableDevices })
  }

  const onMicrophoneSelect = (event: any) => {
    setMicrophoneSelected(event.target.value)
  }

  const onCameraSelect = (event: any) => {
    setCameraSelected(event.target.value)
  }

  const onRetryMedia = () => {
    retry()
  }

  return (
    <Box>
      <CardContent className={classes.container}>
        {error && (
          <Alert
            className={classes.errorAlert}
            sx={{ width: '100%' }}
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={onRetryMedia}>
                RETRY
              </Button>
            }
          >
            {error.statusText}
          </Alert>
        )}
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          autoPlay
          playsInline
          muted
          onContextMenu={() => false}
          className={classes.video}
        />
        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          {/* {cameraSelected && ( */}
          <MediaControl
            icon={<Mic />}
            options={devices.microphones.map((d: MediaDeviceInfo) => {
              return { name: d.label, value: d.deviceId }
            })}
            onChange={(sel: MediaControlOption) => {
              setMicrophoneSelected(sel.value)
            }}
            value={cameraSelected}
            disabled={loading}
          />
          {/* )} */}
          {/* {microphoneSelected && ( */}
          <MediaControl
            icon={<Videocam sx={{ color: 'rgb(156, 243, 97)' }} />}
            options={devices.cameras.map((d: MediaDeviceInfo) => {
              return { name: d.label, value: d.deviceId }
            })}
            onChange={(sel: MediaControlOption) => {
              setCameraSelected(sel.value)
            }}
            value={microphoneSelected}
            disabled={loading}
          />
          {/* )} */}
        </Stack>
        <Stack direction="column" alignItems="center" sx={{ paddingTop: '16px', width: '100%' }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            Select Speaker
          </Typography>
          <MediaControl
            icon={<Speaker sx={{ color: 'rgb(156, 243, 97)' }} />}
            options={devices.speakers.map((d: MediaDeviceInfo) => {
              return { name: d.label, value: d.deviceId }
            })}
            onChange={(sel: MediaControlOption) => {
              setSpeakerSelected(sel.value)
            }}
            value={speakerSelected}
            disabled={loading}
          />
        </Stack>
        {loading && (
          <Box className={classes.loadingContainer}>
            <Loading />
          </Box>
        )}
      </CardContent>
    </Box>
  )
}

export default MediaSetup
