import React, { RefObject } from 'react'
import { Box, Slider, Stack, Button } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import { VODHLSItem } from '../../models/VODHLSItem'

import useStyles from './VODHLSPlayback.module'
import VODHLSContext from '../../components/VODHLSContext/VODHLSContext'
import VODHLSPlayer, { VODHLSPlayerRef } from './VODHLSPlayer'
import VODHLSThumbnail, { VODHLSThumbnailRef } from './VODHLSThumbnail'
const useVODHLSContext = () => React.useContext(VODHLSContext.Context)

const formatTime = (value: number) => {
  let hrs = 0
  let mins = value === 0 ? 0 : value / 60
  let secs = 0
  if (mins >= 60) {
    hrs = mins / 60
    mins = mins % 60
  }
  secs = value === 0 ? 0 : value % 60

  const formattedArr = []
  if (hrs > 0) {
    hrs < 10 ? formattedArr.push(`0${Math.round(hrs)}`) : formattedArr.push(Math.round(hrs).toFixed())
  }
  formattedArr.push(mins < 10 ? `0${Math.round(mins)}` : Math.round(mins).toFixed())
  formattedArr.push(secs < 10 ? `0${Math.round(secs)}` : Math.round(secs).toFixed())
  return formattedArr.join(':')
}

export interface VODHLSPlaybackReelRef {
  setVolume(value: number): any
}

interface VODHLSPlaybackReelProps {
  style: any
  list: [VODHLSItem]
}

const VODHLSPlaybackReel = React.forwardRef((props: VODHLSPlaybackReelProps, ref: React.Ref<VODHLSPlaybackReelRef>) => {
  const { style, list } = props

  React.useImperativeHandle(ref, () => ({ setVolume }))

  const { vod, setCurrentTime, setSelectedItem, setIsPlaying } = useVODHLSContext()

  const { classes } = useStyles()
  const [volume, setVideoVolume] = React.useState<number>(1)

  const playerRefs = React.useMemo(
    () =>
      Array(list.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const thumbnailRefs = React.useMemo(
    () =>
      Array(list.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const [maxTime, setMaxTime] = React.useState<number>(0)

  React.useEffect(() => {
    let isDead = false
    const draw = () => {
      screencast()
      if (!isDead) {
        requestAnimationFrame(draw)
      }
    }
    draw()
    return () => {
      isDead = true
    }
  }, [])

  React.useEffect(() => {
    playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).setVolume(volume))
  }, [volume])

  React.useEffect(() => {
    playerRefs.forEach((ref) => {
      console.log(vod.seekTime, ref)
      ;((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(vod.seekTime, vod.isPlaying)
    })
  }, [vod.seekTime])

  React.useEffect(() => {
    if (vod.isPlaying) {
      playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).play())
    } else {
      playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).pause(true))
    }
  }, [vod.isPlaying])

  const screencast = () => {
    thumbnailRefs.forEach((ref) => {
      const tRef = ref as RefObject<VODHLSThumbnailRef>
      if (tRef && tRef.current) {
        ;(tRef.current as VODHLSThumbnailRef).redraw()
      }
    })
  }

  const setVolume = (value: number) => {
    setVideoVolume(value)
  }

  const onHLSPlay = (index: number, item: VODHLSItem) => {
    setIsPlaying(true)
  }

  const onHLSPause = (index: number, item: VODHLSItem, andResume: boolean) => {
    setIsPlaying(false)
  }

  const onHLSTimeUpdate = (index: number, item: VODHLSItem, time: number) => {
    if (vod.selectedItem.filename === item.filename) {
      setCurrentTime(time)
    }
  }

  const onPlayRequest = () => {
    setIsPlaying(!vod.isPlaying, true)
  }

  const onHLSLoad = (index: number, item: VODHLSItem, totalTime: number) => {
    if (totalTime > maxTime) {
      setMaxTime(totalTime)
    }
    // Assign and watch thumbnails.
    const thumbnail = thumbnailRefs.find((ref) =>
      ((ref as RefObject<VODHLSThumbnailRef>).current as VODHLSThumbnailRef).hasItem(item)
    )
    const playerRef = playerRefs[index] as RefObject<VODHLSPlayerRef>
    if (thumbnail && playerRef) {
      ;(thumbnail.current as VODHLSThumbnailRef).watch(playerRef.current as VODHLSPlayerRef)
    }
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setCurrentTime(newValue, true)
      playerRefs.forEach((ref) =>
        ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(newValue, vod.isPlaying)
      )
    }
  }

  const onThumbnailSelect = (item: VODHLSItem) => {
    setSelectedItem(item, true)
  }

  return (
    <Box className={classes.container} sx={style}>
      <Stack className={classes.videoStack}>
        {new Array(list.length).fill(0).map((inp, index) => (
          <VODHLSPlayer
            sx={{ opacity: vod.selectedItem.filename === list[index].filename ? '1!important' : '0!important' }}
            key={`vod_${index}`}
            ref={playerRefs[index] as RefObject<VODHLSPlayerRef>}
            index={index}
            item={list[index]}
            volume={volume || 1}
            muted={!(vod.selectedItem === list[index])}
            onPlay={onHLSPlay}
            onPause={onHLSPause}
            onTimeUpdate={onHLSTimeUpdate}
            onHLSLoad={onHLSLoad}
          ></VODHLSPlayer>
        ))}
        {!vod.isPlaying && (
          <Button className={classes.playButton} color="inherit" onClick={onPlayRequest}>
            <PlayCircleOutlineIcon className={classes.playIcon} />
          </Button>
        )}
      </Stack>
      <Stack direction="column" gap={0} className={classes.thumbnailControlsContainer}>
        <Stack direction="row" gap={2} className={classes.thumbnailReel}>
          {new Array(list.length).fill(0).map((inp, index) => (
            <VODHLSThumbnail
              sx={{
                flexGrow: 1,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
              key={`thumbnail_${index}`}
              ref={thumbnailRefs[index] as RefObject<VODHLSThumbnailRef>}
              vodHLSItem={list[index]}
              onSelect={onThumbnailSelect}
            ></VODHLSThumbnail>
          ))}
        </Stack>
        <Stack direction="row" gap={1} className={classes.controls}>
          <Slider
            sx={{
              zIndex: 201,
              '& input[type="range"]': {
                WebkitAppearance: 'slider-horizontal',
              },
            }}
            disabled={maxTime === 0}
            orientation="horizontal"
            defaultValue={0}
            aria-label="Playback Time"
            valueLabelDisplay="auto"
            valueLabelFormat={formatTime}
            min={0}
            max={maxTime}
            step={1}
            value={vod.currentTime}
            onChange={onSliderChange}
          />
          {vod.isPlaying && (
            <Button className={classes.pauseButton} color="inherit" onClick={onPlayRequest}>
              <PauseCircleOutlineIcon className={classes.pauseIcon} />
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
})

VODHLSPlaybackReel.displayName = 'VODHLSPlaybackReel'
export default VODHLSPlaybackReel
