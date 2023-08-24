import * as React from 'react'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { startAdapter } from '../../utils/adapterConfig'

interface IMediaProviderProps {
  children: any
}

interface IMediaContextProps {
  error: any | undefined
  loading: boolean
  constraints: any | undefined
  mediaStream: MediaStream | undefined
  cameraSelected: string | undefined
  microphoneSelected: string | undefined
  speakerSelected: string | undefined
  permissionsChanged: boolean
  setCameraSelected: (deviceId: string | undefined) => void
  setMicrophoneSelected: (deviceId: string | undefined) => void
  setSpeakerSelected: (deviceId: string | undefined) => void
  setConstraints: (constraints: any) => void
  setMediaStream: (stream: MediaStream | undefined) => void
  clearPermissionsChanged: () => void
  dismissError: () => void
  retry: () => void
}

const MediaContext = React.createContext<any | null>(null)

const MediaProvider = (props: IMediaProviderProps) => {
  const { children } = props

  const [error, setError] = React.useState<any | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [constraints, setConstraints] = React.useState<any | undefined>()
  const [mediaStream, setMediaStream] = React.useState<MediaStream | undefined>()
  const [cameraSelected, setCameraSelected] = React.useState<string | undefined>()
  const [microphoneSelected, setMicrophoneSelected] = React.useState<string | undefined>()
  const [speakerSelected, setSpeakerSelected] = React.useState<string | undefined>()
  const [permissionsChanged, setPermissionsChanged] = React.useState<boolean>(false)

  React.useEffect(() => {
    startAdapter()
  }, [])

  React.useEffect(() => {
    if (constraints) {
      getMediaStream()
    }
  }, [constraints])

  React.useEffect(() => {
    if (cameraSelected) {
      // if (typeof constraints.video === 'boolean') {
      //   constraints.video = {}
      // }
      console.log('SETTING CAMERA DEVICE', cameraSelected)
      const videoConstraint = { ...constraints.video, deviceId: { exact: cameraSelected } }
      setConstraints({
        ...constraints,
        video: videoConstraint,
      })
    }
  }, [cameraSelected])

  React.useEffect(() => {
    if (microphoneSelected) {
      // if (typeof constraints.audio === 'boolean') {
      //   constraints.audio = {}
      // }
      console.log('SETTING MICROPHONE DEVICE', microphoneSelected)
      const audioConstraint = { ...constraints.audio, deviceId: { exact: microphoneSelected } }
      setConstraints({
        ...constraints,
        audio: audioConstraint,
      })
    }
  }, [microphoneSelected])

  // WAT-279
  const hasAlreadyRequestedDevices = async () => {
    try {
      const cameraName = 'camera' as PermissionName
      const status = await navigator.permissions.query({ name: cameraName })
      const hasGranted = status.state === 'granted'
      if (!hasGranted) {
        status.onchange = () => {
          setPermissionsChanged(true)
          if (status.state === 'granted') {
            getMediaStream()
          }
        }
      }
      return hasGranted
    } catch (e) {
      console.error(e)
    }
    return false
  }

  const getMediaStream = async () => {
    setMediaStream(undefined)
    setError(undefined)
    setLoading(true)
    try {
      console.log('REQUEST CONSTRAINTS', constraints)
      const hasAlreadyRequested = await hasAlreadyRequestedDevices()
      console.log('HAS ALREADY REQUESTED PERMISSION?', hasAlreadyRequested)
      const mStream = await navigator.mediaDevices.getUserMedia(constraints)
      setLoading(false)
      setMediaStream(mStream)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError({
        status: 0,
        statusText: `It appears this camera or microphone isn't working properly. Please select a different camera or microphone. ${
          (e as Error).message
        }.`,
      })
    }
  }

  const clearPermissionsChanged = () => {
    setPermissionsChanged(false)
  }

  const dismissError = () => {
    setError(undefined)
    setLoading(false)
  }

  const retry = () => {
    getMediaStream()
  }

  const values = {
    error,
    loading,
    mediaStream,
    constraints,
    cameraSelected,
    microphoneSelected,
    speakerSelected,
    permissionsChanged,
    setCameraSelected,
    setMicrophoneSelected,
    setSpeakerSelected,
    setConstraints,
    setMediaStream,
    dismissError,
    clearPermissionsChanged,
    retry,
  }

  return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}

export default {
  Context: MediaContext,
  Consumer: MediaContext.Consumer,
  Provider: MediaProvider,
}
