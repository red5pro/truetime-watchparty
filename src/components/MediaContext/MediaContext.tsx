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
  setCameraSelected: (deviceId: string | undefined) => void
  setMicrophoneSelected: (deviceId: string | undefined) => void
  setConstraints: (constraints: any) => void
  setMediaStream: (stream: MediaStream | undefined) => void
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
      const audioConstraint = { ...constraints.audio, deviceId: { exact: microphoneSelected } }
      setConstraints({
        ...constraints,
        audio: audioConstraint,
      })
    }
  }, [microphoneSelected])

  const getMediaStream = async () => {
    setError(undefined)
    setLoading(true)
    try {
      console.log('REQUEST CONSTRAINTS', constraints)
      const mStream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaStream(mStream)
    } catch (e) {
      console.error(e)
      setError({
        status: 0,
        statusText: `Could not instantiate media: ${(e as Error).message}`,
      })
    } finally {
      setLoading(false)
    }
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
    setCameraSelected,
    setMicrophoneSelected,
    setConstraints,
    setMediaStream,
    retry,
  }

  return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}

export default {
  Context: MediaContext,
  Consumer: MediaContext.Consumer,
  Provider: MediaProvider,
}
