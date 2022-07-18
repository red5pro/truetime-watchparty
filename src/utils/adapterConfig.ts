import adapter from 'webrtc-adapter'
import { SessionStorage } from './sessionStorageUtils'

const getParameterByName = (name: string, url?: string) => {
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const defineIceServers = (jsonInput: any) => {
  const param = getParameterByName('ice')
  const jsonOutput = { ...jsonInput }
  if (param) {
    if (param === 'moz') {
      jsonOutput.rtcConfiguration.iceServers = jsonInput.mozIce
    } else {
      jsonOutput.rtcConfiguration.iceServers = jsonInput.googleIce
    }

    console.log(
      'ICE server provided in query param: ' + JSON.stringify(jsonOutput.rtcConfiguration.iceServers, null, 2)
    )
  }
  return jsonOutput
}

const setInSessionStorage = () => {
  const buildVersion = '$VERSION'
  const isMoz = window.navigator.userAgent.search('Firefox')
  const isEdge = window.navigator.userAgent.indexOf('Edge') > -1
  const isiPod = !!navigator.platform && /iPod/.test(navigator.platform)

  const isSecure = window.location.protocol.includes('https')

  const json = {
    version: buildVersion,
    host: 'watchtest.red5.net',
    port: isSecure ? 443 : 5080,
    stream1: 'stream1',
    stream2: 'stream2',
    app: 'live',
    proxy: 'streammanager',
    streamMode: 'live',
    cameraWidth: 640,
    cameraHeight: 480,
    embedWidth: '100%',
    embedHeight: 480,
    buffer: 0.5,
    bandwidth: {
      audio: 56,
      video: 750,
    },
    signalingSocketOnly: true,
    keyFramerate: 3000,
    useAudio: true,
    useVideo: true,
    mediaConstraints: {
      audio: isiPod ? false : true,
      video:
        isMoz || isEdge
          ? true
          : {
              width: {
                min: 320,
                max: 640,
              },
              height: {
                min: 240,
                max: 480,
              },
              frameRate: {
                min: 8,
                max: 30,
              },
            },
    },
    publisherFailoverOrder: 'rtc,rtmp',
    subscriberFailoverOrder: 'rtc,rtmp,hls',
    rtcConfiguration: {
      iceServers: [
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
      bundlePolicy: 'max-bundle',
      iceCandidatePoolSize: 2,
      iceTransportPolicy: 'all',
      rtcpMuxPolicy: 'require',
    },
    googleIce: [
      {
        urls: 'stun:stun2.l.google.com:19302',
      },
    ],
    mozIce: [
      {
        urls: 'stun:stun.services.mozilla.com:3478',
      },
    ],
    iceTransport: 'udp',
    verboseLogging: true,
    recordBroadcast: false,
    muteOnAutoplayRestriction: true,
    mediaElementId: 'red5pro-subscriber',
    subscriptionId: 'lou' + Math.floor(Math.random() * 0x10000).toString(16),
    // authentication: {
    //   enabled: false,
    //   username: 'user',
    //   password: 'pass',
    // },
  }

  const jsonUpdated = defineIceServers(json)
  SessionStorage.set('r5proTestBed', JSON.stringify(jsonUpdated))

  return jsonUpdated
}

const startAdapter = () => {
  if (typeof adapter !== 'undefined') {
    console.log('Browser: ' + JSON.stringify(adapter.browserDetails, null, 2))
  }

  const json = setInSessionStorage()

  const buildVersion = '$VERSION'
  if (json) {
    try {
      if (json.version && json.version !== buildVersion) {
        console.log(
          'We have replaced your stale session version: ' +
            json.version +
            ' with ' +
            buildVersion +
            '. Have fun streaming!'
        )
        SessionStorage.remove('r5proTestBed')
        setInSessionStorage()
      } else if (!json.version) {
        console.log(
          'We recently added session swaps with the latest version: ' + buildVersion + '. Have fun streaming!'
        )
        SessionStorage.remove('r5proTestBed')
        setInSessionStorage()
      }
    } catch (e) {
      setInSessionStorage()
    }
  } else {
    setInSessionStorage()
    SessionStorage.set('r5proTestBed', JSON.stringify(json))
  }

  let protocol = window.location.protocol
  const port = window.location.port
  protocol = protocol.substring(0, protocol.lastIndexOf(':'))

  const serverSettings = {
    protocol: protocol,
    httpport: port,
    hlsport: 5080,
    hlssport: 443,
    wsport: 5080,
    wssport: 443,
    rtmpport: 1935,
    rtmpsport: 1936,
  }

  SessionStorage.set('r5proServerSettings', JSON.stringify(serverSettings))
  return json
}

export { startAdapter }
