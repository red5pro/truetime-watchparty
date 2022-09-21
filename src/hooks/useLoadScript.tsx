import * as React from 'react'
import { loadFBScriptAsyncronously } from '../utils/facebookScript'

export const useLoadScript = () => {
  const [facebookLoaded, setFacebookLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fb = document.getElementById('facebook-jssdk')

    if (!fb) {
      loadFBScriptAsyncronously(setFacebookLoaded)
    } else if (window.FB) {
      // could be cached or from internal router
      //   and never invoke `load` by the time the event listener is signed.
      setFacebookLoaded(true)
    }
  }, [])

  return facebookLoaded
}
