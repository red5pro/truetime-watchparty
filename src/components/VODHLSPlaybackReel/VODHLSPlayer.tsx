import React from 'react'
import { Box, Typography } from '@mui/material'
import { VODHLSItem } from '../../models/VODHLSItem'
import Hls from 'hls.js'
import { supportsHLS } from '../../utils/hlsUtils'

interface VODHLSPlayerProps {
  item: VODHLSItem
  onHLSLoad(item: VODHLSItem, totalTime: number): any
}

const VODHLSPlayer = (props: VODHLSPlayerProps) => {
  const { item, onHLSLoad } = props

  const videoRef: any = React.useRef(null)

  const [requiresSource, setRequiresSource] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!supportsHLS() && videoRef.current) {
      const hls = new Hls({ debug: false, backBufferLength: 0 })
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(item.url!)
      })
      hls.on(Hls.Events.MANIFEST_LOADED, (event: any, data: any) => {
        checkReadyState()
      })
    } else {
      setRequiresSource(true)
      videoRef.current.autoplay = true
      checkReadyState()
    }
  }, [item, videoRef])

  const checkReadyState = (timeout?: any | undefined) => {
    if (timeout) clearTimeout(timeout)
    const { readyState, duration } = videoRef.current
    // Firefox needs OR because readyState never gets above 1.
    const targetClause = supportsHLS() ? readyState > 1 && !isNaN(duration) : readyState > 1 || !isNaN(duration)
    if (targetClause && duration > 0) {
      onHLSLoad(item, duration)
      pause()
      videoRef.current.autoplay = false
      videoRef.current.currentTime = 0
      return
    }
    const t: any = setTimeout(() => checkReadyState(t), 500)
  }

  const pause = async () => {
    try {
      await videoRef.current.pause()
    } catch (e) {
      console.error('PAUSE', e)
    }
  }

  return (
    <Box>
      <video ref={videoRef}>{requiresSource && <source src={item.url}></source>}</video>
      <Typography>{item.name}</Typography>
    </Box>
  )
}

export default VODHLSPlayer
