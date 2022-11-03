import React from 'react'
import Hls from 'hls.js'
import { Box, Button } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { VODHLSItem } from '../../models/VODHLSItem'
import { supportsHLS } from '../../utils/hlsUtils'
import useStyles from './VODHLSPlayback.module'

export interface VODHLSPlayerRef {
  play(): any
  pause(resume: boolean): any
  seek(to: number, andPlay?: boolean): any
  destroy(): any
  getVideo(): HTMLVideoElement
}

interface VODHLSPlayerProps {
  sx: any
  index: number
  item: VODHLSItem
  muted: boolean
  onPlay(index: number, item: VODHLSItem): any
  onPause(index: number, item: VODHLSItem, andResume: boolean): any
  onHLSLoad(index: number, item: VODHLSItem, totalTime: number): any
}

const VODHLSPlayer = React.forwardRef((props: VODHLSPlayerProps, ref: React.Ref<VODHLSPlayerRef>) => {
  const { sx, index, item, muted, onPlay, onPause, onHLSLoad } = props

  React.useImperativeHandle(ref, () => ({ play, pause, seek, destroy, getVideo }))

  const { classes } = useStyles()

  const videoRef: any = React.useRef(null)
  let playTimeout: any
  const playRef = React.useRef(null)

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isDestroyed, setIsDestroyed] = React.useState<boolean>(false)
  const [requiresSource, setRequiresSource] = React.useState<boolean>(false)

  const [control, setControl] = React.useState<any>()

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
      setControl(hls)
    } else {
      setRequiresSource(true)
      videoRef.current.autoplay = true
      checkReadyState()
      setControl({
        destroy: () => {
          console.log('SOURCE', 'destroy')
        },
      })
    }
  }, [item, videoRef])

  const checkReadyState = (timeout?: any | undefined) => {
    if (timeout) clearTimeout(timeout)
    const { readyState, duration } = videoRef.current
    // Firefox needs OR because readyState never gets above 1.
    const targetClause = supportsHLS() ? readyState > 1 && !isNaN(duration) : readyState > 1 || !isNaN(duration)
    if (targetClause && duration > 0) {
      onHLSLoad(index, item, duration)
      pause()
      videoRef.current.autoplay = false
      videoRef.current.currentTime = 0
      return
    }
    const t: any = setTimeout(() => checkReadyState(t), 500)
  }

  const stopPlayTimeout = () => {
    if (playRef.current) {
      clearTimeout(playRef.current)
    }
    clearTimeout(playTimeout)
  }

  const resetPlayTimeout = () => {
    stopPlayTimeout()
    playTimeout = setTimeout(() => {
      if (isPlaying) {
        play()
      }
    }, 1000)
    playRef.current = playTimeout
  }

  const play = async () => {
    try {
      await videoRef.current.play()
      setIsPlaying(true)
    } catch (e: any) {
      console.log(`Could not start playback for ${item.name}: ${e.message}`)
    }
  }

  const pause = async (resume = false) => {
    const wasPlaying = isPlaying
    try {
      await videoRef.current.pause()
      if (!resume) {
        setIsPlaying(false)
      }
    } catch (e: any) {
      console.log(`Could not start playback for ${item.name}: ${e.message}`)
    } finally {
      if (resume) {
        setIsPlaying(wasPlaying)
      }
    }
  }

  const seek = async (to: number, andPlay = false) => {
    try {
      stopPlayTimeout()
      await pause(true)
      const { duration } = videoRef.current
      videoRef.current.currentTime = to <= duration ? to : duration
      if (isPlaying && andPlay && to < videoRef.current.duration) {
        resetPlayTimeout()
      }
    } catch (e) {
      console.warn('SEEK', e)
    }
  }

  const destroy = async () => {
    stopPlayTimeout()
    setIsDestroyed(true)
    try {
      await pause()
      control.destroy()
    } catch (e) {
      console.log(e)
    }
  }

  const getVideo = () => {
    if (videoRef && videoRef.current) {
      return videoRef.current
    }
    return undefined
  }

  const onPlayRequest = () => {
    if (isPlaying) {
      onPause(index, item, false)
    } else {
      onPlay(index, item)
    }
    console.log('PLAY', item.name)
  }

  return (
    <Box sx={sx} className={classes.playerContainer} display="flex" justifyContent="center" alignItems="center">
      <video ref={videoRef} className={classes.player} muted={muted} playsInline={true} loop={true}>
        {requiresSource && <source src={item.url}></source>}
      </video>
      <Button className={classes.playButton} color="inherit" onClick={onPlayRequest}>
        <PlayCircleOutlineIcon className={classes.playIcon} />
      </Button>
    </Box>
  )
})

VODHLSPlayer.displayName = 'VODHLSPlayer'
export default VODHLSPlayer
