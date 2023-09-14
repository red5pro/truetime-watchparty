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
interface DeviceInfo {
  currentTrack: MediaStreamTrack | undefined
  availableDevices: MediaDeviceInfo[]
}

const updateCameraDeviceList = (videoTrack: any, devices: MediaDeviceInfo[]) => {
  const cameras = devices.filter((item: MediaDeviceInfo) => {
    return item.kind === 'videoinput'
  })
  return {
    currentTrack: videoTrack,
    availableDevices: cameras,
  }
}

function updateAudioDeviceList(audioTrack: any, devices: MediaDeviceInfo[]) {
  const mics = devices.filter((item: MediaDeviceInfo) => {
    return item.kind === 'audioinput'
  })
  return {
    currentTrack: audioTrack,
    availableDevices: mics,
  }
}

function updateAudioOutputDeviceList(audioTrack: any, devices: MediaDeviceInfo[]) {
  const speakers = devices.filter((item: MediaDeviceInfo) => {
    return item.kind === 'audiooutput'
  })
  return {
    currentTrack: audioTrack,
    availableDevices: speakers,
  }
}

export const getDeviceListing = async (mediaStream?: MediaStream) => {
  let videoTrack: any = null
  let audioTrack: any = null
  if (mediaStream) {
    const tracks = mediaStream.getTracks()
    const audioTracks = tracks.filter((track: any) => {
      return track.kind.includes('audio')
    })
    const videoTracks = tracks.filter((track: any) => {
      return track.kind.includes('video')
    })
    videoTrack = videoTracks.length > 0 ? videoTracks[0] : null
    audioTrack = audioTracks.length > 0 ? audioTracks[0] : null
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log('Available Devices', devices)
    const cameraList = updateCameraDeviceList(videoTrack, devices)
    const microphoneList = updateAudioDeviceList(audioTrack, devices)
    const audioOutputList = updateAudioOutputDeviceList(undefined, devices)
    return [cameraList, microphoneList, audioOutputList]
  } catch (error: any) {
    console.error('Could not access camera devices: ' + error)
    return []
  }
}
