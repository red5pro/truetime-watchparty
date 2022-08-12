import * as React from 'react'
import { Box, CardContent, MenuItem, Select } from '@mui/material'

import MediaContext from '../MediaContext/MediaContext'
import useMediaStyles from './MediaSetup.module'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { getDeviceListing } from '../../utils/deviceSelectorUtil'

const deviceReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CAMERAS':
      return { ...state, cameras: action.payload }
    case 'MICROPHONES':
      return { ...state, microphones: action.payload }
  }
}

interface IMediaSetupProps {
  selfCleanup: boolean
}

const MediaSetup = ({ selfCleanup }: IMediaSetupProps) => {
  const mediaContext = React.useContext(MediaContext.Context)

  const videoRef: any = React.useRef(null)
  const { classes } = useMediaStyles()

  const [devices, dispatch] = React.useReducer(deviceReducer, { cameras: [], microphones: [] })
  // TODO: store constraints?
  const [storedConstraints, setStoredConstraints] = React.useState<any | undefined>()

  React.useEffect(() => {
    if (mediaContext && !mediaContext?.constraints) {
      mediaContext?.setConstraints(storedConstraints || DEFAULT_CONSTRAINTS)
    }
  }, [])

  React.useEffect(() => {
    if (mediaContext && mediaContext.mediaStream) {
      getDevices(mediaContext.mediaStream)
    }
  }, [mediaContext?.mediaStream])

  React.useEffect(() => {
    const video: any = videoRef.current
    if (mediaContext?.mediaStream) {
      const { srcObject } = videoRef
      if (srcObject !== mediaContext?.mediaStream) {
        video.srcObject = mediaContext.mediaStream
      }
    }

    return () => {
      // TODO: This may need to be pushed to parent container
      //        as we may want to maintain the media stream when publishing.
      if (typeof selfCleanup === 'boolean' && selfCleanup) {
        if (video && video.srcObject) {
          video.srcObject.getTracks().forEach((t: MediaStreamTrack) => t.stop())
          mediaContext?.setConstraints(undefined)
          mediaContext?.setMediaStream(undefined)
        }
      }
      video.srcObject = null
    }
  }, [videoRef, mediaContext?.mediaStream])

  const getDevices = async (stream: MediaStream) => {
    const [cameras, microphones] = await getDeviceListing(stream)
    const selectedCamera = cameras.availableDevices.find((d) => d.label === cameras.currentTrack.label)
    const selectedMicrophone = microphones.availableDevices.find((d) => d.label === microphones.currentTrack.label)
    mediaContext?.setCameraSelected(selectedCamera?.deviceId)
    mediaContext?.setMicrophoneSelected(selectedMicrophone?.deviceId)
    dispatch({ type: 'CAMERAS', payload: cameras.availableDevices })
    dispatch({ type: 'MICROPHONES', payload: microphones.availableDevices })
  }

  const onMicrophoneSelect = (event: any) => {
    mediaContext?.setMicrophoneSelected(event.target.value)
  }

  const onCameraSelect = (event: any) => {
    mediaContext?.setCameraSelected(event.target.value)
  }

  return (
    <Box>
      <CardContent className={classes.container}>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls
          autoPlay
          playsInline
          muted
          onContextMenu={() => false}
          className={classes.video}
        />
        {mediaContext && mediaContext.cameraSelected && (
          <Select onChange={onCameraSelect} value={mediaContext.cameraSelected}>
            {devices.cameras.map((d: MediaDeviceInfo) => {
              return (
                <MenuItem key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </MenuItem>
              )
            })}
          </Select>
        )}
        {mediaContext && mediaContext.microphoneSelected && (
          <Select onChange={onMicrophoneSelect} value={mediaContext.microphoneSelected}>
            {devices.microphones.map((d: MediaDeviceInfo) => {
              return (
                <MenuItem key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </MenuItem>
              )
            })}
          </Select>
        )}
      </CardContent>
    </Box>
  )
}

export default MediaSetup
