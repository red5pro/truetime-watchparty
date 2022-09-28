import { FACEBOOK_APP_ID } from '../settings/variables'

export const loadFBScriptAsyncronously = (callback: (value: boolean) => void) => {
  let rootElem = document.getElementById('fb-root')
  if (!rootElem) {
    rootElem = document.createElement('div')
    rootElem.id = 'fb-root'
    document.body.appendChild(rootElem)
  }

  //TODO: CHANGE THIS TO USE GEO LOC
  const location = 'en_US'

  const script = document.createElement('script')
  script.id = 'facebook-jssdk'
  script.src = `https://connect.facebook.net/${location}/sdk.js#xfbml=1&version=v14.0`
  script.nonce = 'Pv4Itb3k'
  script.async = true
  script.defer = true
  script.crossOrigin = 'anonymous'

  document.body.appendChild(script)
  script.onload = () => {
    if (callback) {
      callback(true)

      window.FB.init({
        appId: FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.6',
        cookie: true,
        status: true,
      })
    }
  }

  script.onerror = () => {
    loadFBScriptAsyncronously(callback)
  }
}
