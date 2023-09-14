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
        }`,
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

  const stopScreenShareMedia = (captureStream?: MediaStream | null) => {
    const tracks = captureStream
      ? captureStream.getTracks()
      : screenshareMediaStream
      ? screenshareMediaStream.getTracks()
      : null
    if (tracks) {
      tracks.forEach((track: any) => track.stop())
      setScreenshareMediaStream(undefined)
      // setScreenShare(false)
    }
  }

  const startScreenShareMedia = async () => {
    const displayMediaOptions: MediaStreamConstraints = {
      audio: false,
      video: {
        aspectRatio: 1 / 1,
        height: {
          ideal: 1200,
        },
      },
    }

    let captureStream: MediaStream | null = null
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    captureStream.getVideoTracks()[0].onended = () => {
      stopScreenShareMedia(captureStream)
    }
    setScreenshareMediaStream(captureStream)
    return captureStream
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
    startScreenShareMedia,
    stopScreenShareMedia,
    // screenshareMediaStream,
  }

  return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}

export default {
  Context: MediaContext,
  Consumer: MediaContext.Consumer,
  Provider: MediaProvider,
}
