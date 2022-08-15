import adapter from 'webrtc-adapter'

const startAdapter = () => {
  if (typeof adapter !== 'undefined') {
    console.log('Browser: ' + JSON.stringify(adapter.browserDetails, null, 2))
  }
}

export { startAdapter }
