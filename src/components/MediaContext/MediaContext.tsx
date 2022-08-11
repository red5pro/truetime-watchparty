import * as React from 'react'
import { DEFAULT_CONSTRAINTS } from '../../settings/variables'
import { startAdapter } from '../../utils/adapterConfig'

interface IMediaProviderProps {
  children: any
}

interface IMediaContextProps {
  constraints: any | undefined
  mediaStream: MediaStream | undefined
  cameraSelected: string | undefined
  microphoneSelected: string | undefined
  setCameraSelected: (deviceId: string) => void
  setMicrophoneSelected: (deviceId: string | undefined) => void
  setConstraints: (constraints: any) => void
  setMediaStream: (stream: MediaStream | undefined) => void
}

const MediaContext = React.createContext<IMediaContextProps | null>(null)

const MediaProvider = (props: IMediaProviderProps) => {
  const { children } = props

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
      if (typeof constraints.video === 'boolean') {
        constraints.video = {}
      }
      const videoConstraint = { ...constraints.video, deviceId: cameraSelected }
      setConstraints({
        ...constraints,
        video: videoConstraint,
      })
    }
  }, [cameraSelected])

  React.useEffect(() => {
    if (microphoneSelected) {
      if (typeof constraints.audio === 'boolean') {
        constraints.audio = {}
      }
      const audioConstraint = { ...constraints.audio, deviceId: microphoneSelected }
      setConstraints({
        ...constraints,
        audio: audioConstraint,
      })
    }
  }, [microphoneSelected])

  const getMediaStream = async () => {
    try {
      const mStream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaStream(mStream)
    } catch (e) {
      // TODO: Set Alert?
      console.error(e)
    }
  }

  const values = {
    mediaStream,
    constraints,
    cameraSelected,
    microphoneSelected,
    setCameraSelected,
    setMicrophoneSelected,
    setConstraints,
    setMediaStream,
  }

  return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}

export default {
  Context: MediaContext,
  Consumer: MediaContext.Consumer,
  Provider: MediaProvider,
}
