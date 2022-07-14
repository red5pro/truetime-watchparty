const updateCameraDeviceList = (videoTrack: any, devices: MediaDeviceInfo[]) => {
  const cameras = devices.filter((item: MediaDeviceInfo) => {
    return item.kind === 'videoinput'
  })

  return videoTrack ? [videoTrack, ...cameras] : cameras
}

function updateAudioDeviceList(audioTrack: any, devices: MediaDeviceInfo[]) {
  const mics = devices.filter((item: MediaDeviceInfo) => {
    return item.kind === 'audioinput'
  })

  return audioTrack ? [audioTrack, ...mics] : mics
}

export const allowMediaStreamSwap = async (constraints: any, mediaStream: any) => {
  //beginMediaMonitor
  const tracks = mediaStream.getTracks()
  const audioTracks = tracks.filter((track: any) => {
    return track.kind.includes('audiooutput')
  })
  const videoTracks = tracks.filter((track: any) => {
    return track.kind.includes('video')
  })

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()

    const cameraList = updateCameraDeviceList(videoTracks[0], devices)
    const microphoneList = updateAudioDeviceList(
      audioTracks[0],

      devices
    )

    return [cameraList, microphoneList]
  } catch (error: any) {
    console.error('Could not access camera devices: ' + error)
    return []
  }
}
