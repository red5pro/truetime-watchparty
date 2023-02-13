import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import useQueryParams from '../../hooks/useQueryParams'

import Hls from 'hls.js'

const WatchVODPage = () => {
  const query = useQueryParams()
  const navigate = useNavigate()

  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [streamUrl, setStreamUrl] = React.useState<string>()

  React.useEffect(() => {
    if (query.get('url')) {
      try {
        const url = decodeURIComponent(query.get('url') as string)
        // Debugging. Load Big Buck Bunny for CORS.
        setStreamUrl(/^http:/.exec(url) ? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' : url)
      } catch (e) {
        console.error(e)
        navigate('/watch')
      }
    } else {
      navigate('/watch')
    }
  }, [query])

  React.useEffect(() => {
    if (streamUrl && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          // console.log('video and hls.js are now bound together !')
        })
        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          // console.log(`Video Element is paused? ${(videoRef.current as HTMLMediaElement).paused}`)
          try {
            await videoRef.current?.play()
          } catch (e) {
            console.error(e)
            // Most likely not started from User interaction
            // TODO: show Alert letting them know they have to press play...
          }
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(videoRef.current)
      }
    }
  }, [streamUrl])

  return (
    <Box sx={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </Box>
  )
}

export default WatchVODPage
