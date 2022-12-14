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

  const [screenshareMediaStream, setScreenshareMediaStream] = React.useState<MediaStream | undefined>()
  const [screenShare, setScreenShare] = React.useState<boolean>(false)

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
      const videoConstraint = { ...constraints.video, deviceId: cameraSelected }
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
      const audioConstraint = { ...constraints.audio, deviceId: microphoneSelected }
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

  const stopVideoMedia = (captureStream?: MediaStream | null) => {
    const tracks = captureStream
      ? captureStream.getTracks()
      : screenshareMediaStream
      ? screenshareMediaStream.getTracks()
      : null
    if (tracks) {
      tracks.forEach((track: any) => track.stop())

      setScreenshareMediaStream(undefined)
      setScreenShare(false)
    }
  }

  const startVideoMedia = async () => {
    const displayMediaOptions: DisplayMediaStreamConstraints = {
      audio: false,
      video: {
        aspectRatio: 4 / 3,
        height: {
          ideal: 480,
        },
      },
    }

    let captureStream: MediaStream | null = null

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

      captureStream.getTracks()[0].onended = () => {
        stopVideoMedia(captureStream)
      }

      setScreenshareMediaStream(captureStream)
      setMediaStream(captureStream)
    } catch (err: any) {
      if (err.message === 'Permission denied') {
        setScreenshareMediaStream(undefined)
        setScreenShare(false)
        return
      }
      console.error(`Error: ${err}`)

      setError({ ...(err as any), title: 'Error on sharing your screen.' })
    }
    return captureStream
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
    startVideoMedia,
    screenshareMediaStream,
  }

  return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}

export default {
  Context: MediaContext,
  Consumer: MediaContext.Consumer,
  Provider: MediaProvider,
}
