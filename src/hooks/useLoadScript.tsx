import * as React from 'react'
import { loadFBScriptAsyncronously } from '../utils/facebookScript'

export const useLoadScript = () => {
  const [facebookLoaded, setFacebookLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    document.getElementById('facebook-jssdk')?.addEventListener('load', () => setFacebookLoaded(true))
    document.getElementById('facebook-jssdk')?.addEventListener('error', () => loadFBScriptAsyncronously())

    if (!document.getElementById('facebook-jssdk')) {
      loadFBScriptAsyncronously()
    }
  }, [])

  return facebookLoaded
}
