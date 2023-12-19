/* global SingularGraphics */
import React from 'react'

declare global {
  interface Window {
    SingularGraphics: any
  }
}

interface ISingularLiveOverlayProps {
  token: string
  style?: any
}

const css: any = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 5000,
}

const SingularLiveOverlay = (props: ISingularLiveOverlayProps) => {
  const { token, style } = props
  const [error, setError] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (token) {
      const options = {
        class: 'overlay',
        endpoint: 'http://app.singular.live',
        interactive: false,
        syncGraphics: true,
        showPreloader: true,
        aspect: '',
      }
      const overlay = window.SingularGraphics('SingularOverlay', options)
      overlay.addListener('message', (type: any, params: any) => {
        console.log('Singular.live Message', type, params)
      })
      overlay.addListener('error', (type: any, params: any) => {
        console.error('error', type, params)
        setError(`${type}: ${params ? (typeof params !== 'string' ? JSON.stringify(params) : params) : ''}`)
      })
      overlay.renderAppOutput(token, null, (success: boolean) => {
        if (!success) {
          setError("Couldn't load composition")
        }
      })
    }
  }, [token])

  return (
    <iframe
      id="SingularOverlay"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
      style={css}
      src="https://app.singular.live/singularplayer/client"
    ></iframe>
  )
}

export default SingularLiveOverlay
