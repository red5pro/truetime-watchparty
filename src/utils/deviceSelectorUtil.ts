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
    return [cameraList, microphoneList]
  } catch (error: any) {
    console.error('Could not access camera devices: ' + error)
    return []
  }
}
