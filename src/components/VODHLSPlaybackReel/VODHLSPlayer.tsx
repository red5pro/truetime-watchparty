import React from 'react'
import { useRecoilValue } from 'recoil'
import Hls from 'hls.js'
import { Box, Typography } from '@mui/material'
import { VODHLSItem } from '../../models/VODHLSItem'
import { supportsHLS } from '../../utils/hlsUtils'
import useStyles from './VODHLSPlayback.module'
import vodPlaybackState from '../../atoms/vod/vod'
import { formatTime } from '../../utils/commonUtils'

const itemsAreSimilar = (item1: VODHLSItem, item2: VODHLSItem) => {
  return item2.filename === item1.filename
}

export interface VODHLSPlayerRef {
  play(): any
  pause(resume: boolean): any
  seek(to: number, andPlay?: boolean): any
  show(doShow: boolean): any
  destroy(): any
  setVolume(value: number): any
  getVideo(): HTMLVideoElement
  getDuration(): number
  syncTime(value: number): any
  hasItem(item: VODHLSItem): boolean
}

interface VODHLSPlayerProps {
  sx: any
  index: number
  item: VODHLSItem
  isPlaying: boolean
  // selectedItem: VODHLSItem
  seekTime: number
  volume: number
  onTimeUpdate(index: number, item: VODHLSItem, time: number): any
  onHLSLoad(index: number, item: VODHLSItem, totalTime: number): any
  onHLSFatalError(index: number, item: VODHLSItem, error: string): any
  onPlaybackRestriction(): any
}

const VODHLSPlayer = React.forwardRef((props: VODHLSPlayerProps, ref: React.Ref<VODHLSPlayerRef>) => {
  const {
    sx,
    index,
    item,
    volume,
    seekTime,
    isPlaying,
    onTimeUpdate,
    onHLSLoad,
    onHLSFatalError,
    onPlaybackRestriction,
  } = props

  React.useImperativeHandle(ref, () => ({
    play,
    pause,
    seek,
    show,
    destroy,
    setVolume,
    getVideo,
    getDuration,
    syncTime,
    hasItem,
  }))

  const { classes } = useStyles()

  let isLoaded = false
  const vodState = useRecoilValue(vodPlaybackState)

  // Have to wrap these in refs in order to have updated state in loaded callback... :/
  const [iIsPlaying, setIsPlaying] = React.useState<boolean>(false)
  const playingRef = React.useRef(iIsPlaying)
  const [iSeekTime, setSeekTime] = React.useState<number>(0)
  const seekRef = React.useRef(iSeekTime)
  const [iSelectedItem, setSelectedItem] = React.useState<VODHLSItem | undefined>()
  const selectionRef = React.useRef(iSelectedItem)

  let playTimeout: any
  const playRef = React.useRef(null)
  const videoRef: any = React.useRef(null)

  const [isDestroyed, setIsDestroyed] = React.useState<boolean>(false)
  const [requiresSource, setRequiresSource] = React.useState<boolean>(false)

  const [isVisible, setIsVisible] = React.useState<boolean>(false)

  const [control, setControl] = React.useState<any>()
  const [videoTime, setVideoTime] = React.useState<string>('0')
  const [currentTime, setCurrentTime] = React.useState<number>(0)

  React.useEffect(() => {
    setVolume(volume)
    if (videoRef && videoRef.current) {
      // console.log('[help] SETUP', index)
      videoRef.current.ontimeupdate = onVideoTimeUpdate
      if (supportsHLS()) {
        const update = async () => {
          videoRef.current.currentTime = seekRef.current
          if (playingRef.current) {
            await play()
          } else {
            await pause()
          }
          if (selectionRef.current) {
            show(itemsAreSimilar(item, selectionRef.current))
          }
          updateMuteStatus()
        }
        videoRef.current.oncanplay = () => console.log('[help]::canplay', index)
        videoRef.current.oncanplaythrough = () => {
          // update()
          console.log('[help]::canplaythrough', index)
        }
        videoRef.current.ondurationchange = () => {
          update()
          console.log('[help]::durationchange', index)
        }
        videoRef.current.onloadeddata = () => console.log('[help]::loadeddata', index)
        videoRef.current.onloadedmetadata = () => console.log('[help]::loadedmetadata', index)
        videoRef.current.onstalled = () => console.log('[help]::stalled', index)
        videoRef.current.onsuspend = () => console.log('[help]::suspend', index)
        videoRef.current.onwaiting = () => console.log('[help]::waiting', index)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!supportsHLS() && videoRef.current) {
      const hls = new Hls({ debug: false, backBufferLength: 0, maxBufferLength: 120 })
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(item.url!)
      })
      hls.on(Hls.Events.MANIFEST_LOADED, (event: any, data: any) => {
        checkReadyState()
      })
      hls.on(Hls.Events.ERROR, (event: any, data: any) => {
        const { type } = data
        if (data.fatal) {
          const { details, response } = data
          switch (type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.warn('fatal network error encountered, try to recover')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('fatal media error encountered, try to recover')
              hls.recoverMediaError()
              break
            default:
              // cannot recover
              hls.destroy()
              onHLSFatalError(index, item, `${details} - ${response.code}:: ${response.text}`)
              break
          }
        } else {
          switch (type) {
            case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
              console.warn('buffer stalled error')
              break
            case Hls.ErrorDetails.BUFFER_FULL_ERROR:
              console.warn('buffer full')
              break
          }
        }
      })
      setControl(hls)
    } else {
      videoRef.current.addEventListener('loadedmetadata', checkReadyState)
      setRequiresSource(true)
      setControl({
        destroy: () => {
          console.log('SOURCE', 'destroy')
        },
      })
    }
  }, [item, videoRef])

  React.useEffect(() => {
    const { selection } = vodState
    if (item && selection) {
      if (!selectionRef.current || !itemsAreSimilar(selectionRef.current, selection)) {
        console.log('VOD SELECTION UPDATE', selection, selectionRef.current)
        selectionRef.current = selection
        setSelectedItem(selection)
        show(itemsAreSimilar(item, selection))
      }
    }
  }, [item, vodState.selection])

  React.useEffect(() => {
    const doPlayPause = async (driver: any = undefined) => {
      if (driver) {
        await pause()
      } else if (playingRef.current) {
        await play()
      }
    }
    const { isPlaying, driver } = vodState
    if (playingRef.current !== isPlaying) {
      console.log('VOD STATE UPDATE', index, vodState)
      const playPause = async (doPlay: boolean) => {
        if (doPlay) {
          // console.log('[help]::useEffect, call play')
          await play()
        } else {
          // console.log('[help]::useEffect, call pause')
          await pause()
        }
      }
      playingRef.current = isPlaying
      setIsPlaying(isPlaying)
      playPause(isPlaying)
    }
    doPlayPause(driver)
  }, [vodState.isPlaying, vodState.driver])

  // React.useEffect(() => {
  //   // if (item && selectionRef.current === selectedItem) {
  //   //   return
  //   // }
  //   if (!item || !selectedItem) return
  //   const needsShow = selectionRef.current?.filename !== selectedItem.filename
  //   selectionRef.current = selectedItem
  //   setSelectedItem(selectedItem)
  //   // if (needsShow) {
  //   show(itemsAreSimilar(item, selectedItem))
  //   // }
  //   console.log('[help]:: selection', index, item, iSelectedItem, selectedItem, itemsAreSimilar(item, selectedItem))
  // }, [item, selectedItem])

  React.useEffect(() => {
    // if (seekRef.current === seekTime) {
    //   return
    // }
    // console.log('[help]::seek time', seekTime)
    if (seekRef.current == seekTime) return
    const { updateTs } = vodState
    let seekTo = seekTime
    if (isPlaying) {
      // We are here to discuss how we receive data for synchronization and store it in state,
      // but React batches state updates, so now we have to figure out how long it took
      // for this playhead time to be updated in state... fun.
      const now = new Date().getTime()
      const offset = now - updateTs
      seekTo = seekTime + offset / 1000
    }
    // If we are within a certain time frame, forget it
    if (Math.abs(currentTime - seekTo) < 1.5) {
      console.log('[load]::seek BAIL')
      seekRef.current = seekTo
      return
    }
    console.log('[load]:: seek update', seekRef.current, seekTo, index)
    seekRef.current = seekTo
    setSeekTime(seekTo)
    // seek(seekTo, false, isPlaying)
    fastSeek(seekTo)
  }, [seekTime])

  // React.useEffect(() => {
  //   // if (playingRef.current === isPlaying) {
  //   //   return
  //   // }
  //   const playPause = async (doPlay: boolean) => {
  //     if (doPlay) {
  //       console.log('[help]::useEffect, call play')
  //       await play()
  //     } else {
  //       console.log('[help]::useEffect, call pause')
  //       await pause()
  //     }
  //   }
  //   playingRef.current = isPlaying
  //   setIsPlaying(isPlaying)
  //   playPause(isPlaying)
  //   console.log('[help]:: isPlaying', isPlaying, index)
  // }, [isPlaying])

  const checkReadyState = async (timeout?: any | undefined) => {
    if (timeout) clearTimeout(timeout)
    if (videoRef && videoRef.current) {
      const { duration } = videoRef.current
      // Firefox needs OR because readyState never gets above 1.
      const targetClause = supportsHLS()
        ? videoRef.current.readyState > 1 && !isNaN(duration)
        : videoRef.current.readyState > 1 || !isNaN(duration)
      if (targetClause && duration > 0 && !isLoaded) {
        try {
          isLoaded = true
          videoRef.current.currentTime = seekRef.current
          if (playingRef.current) {
            // console.log('[help]::ready state, call play')
            await play()
          } else {
            // console.log('[help]::ready state, call pause')
            await pause()
          }
          if (selectionRef.current) {
            show(itemsAreSimilar(item, selectionRef.current))
          }
          updateMuteStatus()
          onHLSLoad(index, item, duration)
          return
        } catch (e) {
          console.error(e)
        }
      } else {
        const t: any = setTimeout(() => checkReadyState(t), 500)
      }
    } else {
      const t: any = setTimeout(() => checkReadyState(t), 500)
    }
  }

  const updateMuteStatus = () => {
    if (videoRef.current && selectionRef.current) {
      const isSelected = itemsAreSimilar(item, selectionRef.current)
      videoRef.current.muted = !isSelected
      // console.log('[help]:: muted', index, !isSelected)
    }
  }

  const stopPlayTimeout = () => {
    if (playRef.current) {
      clearTimeout(playRef.current)
    }
    clearTimeout(playTimeout)
  }

  const resetPlayTimeout = () => {
    stopPlayTimeout()
    playTimeout = setTimeout(async () => {
      if (isPlaying) {
        // console.log('[help]::timeout, call pause')
        await play()
      }
    }, 1000)
    playRef.current = playTimeout
  }

  const play = async () => {
    try {
      if (!videoRef.current.paused) return
      // console.log('[help]::play', index)
      await videoRef.current.play()
      playingRef.current = true
      updateMuteStatus()
    } catch (e: any) {
      console.warn(`Could not start playback for ${item.name}: ${e.message}`)
      if (!e.message.match('request was interrupted')) {
        onPlaybackRestriction()
      }
    }
  }

  const pause = async (resume = false) => {
    try {
      if (videoRef.current.paused) return
      // console.log('[help]::pause', index)
      await videoRef.current.pause()
      playingRef.current = false
    } catch (e: any) {
      console.warn(`Could not pause playback for ${item.name}: ${e.message}`)
    }
  }

  const seek = async (to: number, andPause = true, andPlay = false) => {
    const { duration } = videoRef.current
    try {
      // if (andPause) {
      stopPlayTimeout()
      await pause(true)
      // }
      videoRef.current.currentTime = isNaN(duration) ? to : to <= duration ? to : duration - 1
      // if (isPlaying && andPause && andPlay && to < duration) {
      if (isPlaying && andPlay && to < duration) {
        resetPlayTimeout()
      }
    } catch (e) {
      console.warn('SEEK', e)
    }
  }

  const fastSeek = (to: number) => {
    const { duration } = videoRef.current
    videoRef.current.currentTime = isNaN(duration) ? to : to <= duration ? to : duration - 1
  }

  const show = async (doShow: boolean) => {
    setIsVisible(doShow)
    if (isPlaying) {
      // console.log('[help]::show, call play')
      await play()
    } else {
      // console.log('[help]::show, call pause')
      await pause()
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

  const setVolume = (value: number) => {
    if (videoRef && videoRef.current) {
      ;(videoRef.current as HTMLVideoElement).volume = value
    }
  }

  const getVideo = () => {
    if (videoRef && videoRef.current) {
      return videoRef.current
    }
    return undefined
  }

  const hasItem = (value: VODHLSItem) => {
    // TODO: Maybe shallow object compare, instead?
    return itemsAreSimilar(item, value)
  }

  const syncTime = async (value: number) => {
    const video = getVideo()
    if (video && value >= 0) {
      const { currentTime } = video
      seekRef.current = currentTime
      setSeekTime(currentTime)
      // console.log('[help]::synctime', index)
      await seek(value, true, isPlaying)
    }
  }

  const getDuration = () => {
    const video = getVideo()
    if (video) {
      return video.duration
    }
  }

  const onVideoTimeUpdate = async (event: any) => {
    const {
      currentTarget: { currentTime, paused },
    } = event
    if (selectionRef.current && itemsAreSimilar(item, selectionRef.current)) {
      onTimeUpdate(index, item, currentTime)
    }
    setCurrentTime(currentTime)
    setVideoTime(formatTime(currentTime))
    // Trying to catch rogue playpack...
    // if (!paused && !isPlaying) {
    //   await pause(false)
    // }
  }

  return (
    <Box className={classes.playerContainer} sx={{ ...sx, opacity: `${isVisible ? 1 : 0}!important` }}>
      <video ref={videoRef} className={classes.player} style={sx} autoPlay={false} playsInline={true} loop={true}>
        {requiresSource && <source src={item.url} type="application/x-mpegURL"></source>}
      </video>
      {/* <Typography sx={{ color: 'white' }}>
        {currentTime} - {videoTime}
      </Typography> */}
    </Box>
  )
})

VODHLSPlayer.displayName = 'VODHLSPlayer'
export default VODHLSPlayer
