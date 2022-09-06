export const loadFBScriptAsyncronously = () => {
  let rootElem = document.getElementById('fb-root')
  if (!rootElem) {
    rootElem = document.createElement('div')
    rootElem.id = 'fb-root'
    document.body.appendChild(rootElem)
  }

  const script = document.createElement('script')
  script.id = 'facebook-jssdk'
  script.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v14.0`
  script.nonce = 'Pv4Itb3k'
  script.defer = true

  document.body.appendChild(script)
}
