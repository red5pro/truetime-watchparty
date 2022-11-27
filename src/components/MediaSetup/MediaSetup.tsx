import * as React from 'react'
import { Alert, Box, Button, CardContent, MenuItem, Select, Stack } from '@mui/material'

import MediaContext from '../MediaContext/MediaContext'
import useMediaStyles from './MediaSetup.module'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { getDeviceListing } from '../../utils/deviceSelectorUtil'
import Loading from '../Common/Loading/Loading'
import MediaControl, { MediaControlOption } from '../MediaSetup/MediaControl'
import { Mic, Videocam } from '@mui/icons-material'

const useMediaContext = () => React.useContext(MediaContext.Context)

const deviceReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CAMERAS':
      return { ...state, cameras: action.payload }
    case 'MICROPHONES':
      return { ...state, microphones: action.payload }
  }
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
        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          {cameraSelected && (
            <MediaControl
              icon={<Mic />}
              options={devices.microphones.map((d: MediaDeviceInfo) => {
                return { name: d.label, value: d.deviceId }
              })}
              onChange={(sel: MediaControlOption) => {
                setMicrophoneSelected(sel.value)
              }}
              value={cameraSelected}
            />
          )}
          {microphoneSelected && (
            <MediaControl
              icon={<Videocam sx={{ color: 'rgb(156, 243, 97)' }} />}
              options={devices.cameras.map((d: MediaDeviceInfo) => {
                return { name: d.label, value: d.deviceId }
              })}
              onChange={(sel: MediaControlOption) => {
                setCameraSelected(sel.value)
              }}
              value={microphoneSelected}
            />
          )}
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
