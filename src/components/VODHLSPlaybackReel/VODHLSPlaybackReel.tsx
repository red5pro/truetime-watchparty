import React, { RefObject } from 'react'
import { Box, Slider, Stack } from '@mui/material'
import { VODHLSItem } from '../../models/VODHLSItem'

import useStyles from './VODHLSPlayback.module'
import VODHLSContext from '../../components/VODHLSContext/VODHLSContext'
import VODHLSPlayer, { VODHLSPlayerRef } from './VODHLSPlayer'
import VODHLSThumbnail, { VODHLSThumbnailRef } from './VODHLSThumbnail'
const useVODHLSContext = () => React.useContext(VODHLSContext.Context)

interface VODHLSPlaybackReelProps {
  style: any
  list: [VODHLSItem]
}

const VODHLSPlaybackReel = (props: VODHLSPlaybackReelProps) => {
  const { style, list } = props

  const { vod, setCurrentTime, setSelectedItem } = useVODHLSContext()

  const { classes } = useStyles()

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

  const [value, setValue] = React.useState<number>(0)
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
    console.log('SELECTION', vod.selectedItem)
  }, [vod.selectedItem])

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

  const screencast = () => {
    thumbnailRefs.forEach((ref) => {
      const tRef = ref as RefObject<VODHLSThumbnailRef>
      if (tRef && tRef.current) {
        ;(tRef.current as VODHLSThumbnailRef).redraw()
      }
    })
  }

  const onHLSPlay = (index: number, item: VODHLSItem) => {
    playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).play())
  }

  const onHLSPause = (index: number, item: VODHLSItem, andResume: boolean) => {
    playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).pause(andResume))
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
      setValue(newValue)
      setCurrentTime(newValue)
      playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(newValue))
    }
  }

  const onThumbnailSelect = (item: VODHLSItem) => {
    setSelectedItem(item)
  }

  return (
    <Stack className={classes.container} sx={style} direction="column">
      <Stack direction="row" gap={2} className={classes.videoStack}>
        {new Array(list.length).fill(0).map((inp, index) => (
          <VODHLSPlayer
            sx={{
              flexGrow: 1,
              width: '100%',
              display: vod.selectedItem === list[index] ? 'flex' : 'none',
            }}
            key={`vod_${index}`}
            ref={playerRefs[index] as RefObject<VODHLSPlayerRef>}
            index={index}
            item={list[index]}
            muted={!(vod.selectedItem === list[index])}
            onPlay={onHLSPlay}
            onPause={onHLSPause}
            onHLSLoad={onHLSLoad}
          ></VODHLSPlayer>
        ))}
      </Stack>
      <Stack direction="row" gap={2} className={classes.thumbnailReel}>
        {new Array(list.length).fill(0).map((inp, index) => (
          <VODHLSThumbnail
            sx={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
            key={`vod_${index}`}
            ref={thumbnailRefs[index] as RefObject<VODHLSThumbnailRef>}
            vodHLSItem={list[index]}
            onSelect={onThumbnailSelect}
          ></VODHLSThumbnail>
        ))}
      </Stack>
      <Box className={classes.controls}>
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
          value={value}
          onChange={onSliderChange}
        />
      </Box>
    </Stack>
  )
}

export default VODHLSPlaybackReel
