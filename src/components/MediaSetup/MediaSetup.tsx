import * as React from 'react'
import { Alert, Box, Button, CardContent, MenuItem, Select } from '@mui/material'

import MediaContext from '../MediaContext/MediaContext'
import useMediaStyles from './MediaSetup.module'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { getDeviceListing } from '../../utils/deviceSelectorUtil'
import Loading from '../Loading/Loading'

const useMediaContext = () => React.useContext(MediaContext.Context)

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
    retry,
  } = useMediaContext()

  const videoRef: any = React.useRef(null)
  const { classes } = useMediaStyles()

  const [devices, dispatch] = React.useReducer(deviceReducer, { cameras: [], microphones: [] })
  // TODO: store constraints?
  const [storedConstraints, setStoredConstraints] = React.useState<any | undefined>()

  React.useEffect(() => {
    if (!constraints) {
      setConstraints(storedConstraints || DEFAULT_CONSTRAINTS)
    }
  }, [])

  React.useEffect(() => {
    if (mediaStream) {
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

  const getDevices = async (stream: MediaStream) => {
    const [cameras, microphones] = await getDeviceListing(stream)
    const selectedCamera = cameras.availableDevices.find((d) => d.label === cameras.currentTrack.label)
    const selectedMicrophone = microphones.availableDevices.find((d) => d.label === microphones.currentTrack.label)
    setCameraSelected(selectedCamera?.deviceId)
    setMicrophoneSelected(selectedMicrophone?.deviceId)
    dispatch({ type: 'CAMERAS', payload: cameras.availableDevices })
    dispatch({ type: 'MICROPHONES', payload: microphones.availableDevices })
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
        {cameraSelected && (
          <Select sx={{ width: '100%' }} onChange={onCameraSelect} value={cameraSelected}>
            {devices.cameras.map((d: MediaDeviceInfo) => {
              return (
                <MenuItem key={d.deviceId} value={d.deviceId} sx={{ color: 'black' }}>
                  {d.label}
                </MenuItem>
              )
            })}
          </Select>
        )}
        {microphoneSelected && (
          <Select sx={{ width: '100%' }} onChange={onMicrophoneSelect} value={microphoneSelected}>
            {devices.microphones.map((d: MediaDeviceInfo) => {
              return (
                <MenuItem key={d.deviceId} value={d.deviceId} sx={{ color: 'black' }}>
                  {d.label}
                </MenuItem>
              )
            })}
          </Select>
        )}
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
