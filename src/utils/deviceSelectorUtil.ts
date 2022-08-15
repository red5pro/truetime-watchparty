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

export const getDeviceListing = async (mediaStream: any) => {
  const tracks = mediaStream.getTracks()
  const audioTracks = tracks.filter((track: any) => {
    return track.kind.includes('audio')
  })
  const videoTracks = tracks.filter((track: any) => {
    return track.kind.includes('video')
  })

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()

    const cameraList = updateCameraDeviceList(videoTracks[0], devices)
    const microphoneList = updateAudioDeviceList(audioTracks[0], devices)
    return [cameraList, microphoneList]
  } catch (error: any) {
    console.error('Could not access camera devices: ' + error)
    return []
  }
}
