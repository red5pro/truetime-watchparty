import * as React from 'react'
import { startAdapter } from '../../utils/adapterConfig'

interface IRoomProviderProps {
  children: any
  room?: string
  streamName?: string
}

interface IRoomContextProps {
  room: string
  streamName: string
  setCurrentStreamName: (value: string) => void
  mediaStream: MediaStream | undefined
  constraints: any
  setCameraSelected: (value: MediaDeviceInfo) => void
  setMicrophoneSelected: (value: MediaDeviceInfo | any) => void
  cameraSelected: MediaDeviceInfo | undefined
  microphoneSelected: MediaDeviceInfo | any
}

const RoomContext = React.createContext<IRoomContextProps | null>(null)

const RoomProvider = (props: IRoomProviderProps) => {
  const { children, room, streamName } = props

  const [mediaStream, setMediaStream] = React.useState<MediaStream>()
  const [constraints, setConstraints] = React.useState<any>()
  const [currentStreamName, setCurrentStreamName] = React.useState<string>('')
  const [roomName, setRoomName] = React.useState<string>('')
  const [cameraSelected, setCameraSelected] = React.useState<MediaDeviceInfo>()
  const [microphoneSelected, setMicrophoneSelected] = React.useState<MediaDeviceInfo | any>()

  React.useEffect(() => {
    getMediaStream()
  }, [])

  React.useEffect(() => {
    if (streamName) {
      setCurrentStreamName(streamName)
    }
  }, [streamName])

  React.useEffect(() => {
    if (room) {
      setRoomName(room)
    }
  }, [room])

  const getMediaStream = async () => {
    const constraints = {
      audio: true,
      video: {
        width: {
          ideal: 320,
        },
        height: {
          ideal: 240,
        },
      },
    }

    const mStream = await navigator.mediaDevices.getUserMedia(constraints)

    setMediaStream(mStream)
    setConstraints(constraints)
    startAdapter()
  }

  const values = {
    room: roomName,
    streamName: currentStreamName,
    setCurrentStreamName,
    mediaStream,
    constraints,
    setCameraSelected,
    setMicrophoneSelected,
    cameraSelected,
    microphoneSelected,
  }

  return <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
}

export default {
  Context: RoomContext,
  Consumer: RoomContext.Consumer,
  Provider: RoomProvider,
}
