import React, { RefObject } from 'react'
import { useRecoilValue } from 'recoil'
import { Box, Slider, Stack, Button, Typography } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import { VODHLSItem } from '../../models/VODHLSItem'

import useStyles from './VODHLSPlayback.module'
import VODHLSContext from '../../components/VODHLSContext/VODHLSContext'
import VODHLSPlayer, { VODHLSPlayerRef } from './VODHLSPlayer'
import VODHLSThumbnail, { VODHLSThumbnailRef } from './VODHLSThumbnail'
import vodPlaybackState from '../../atoms/vod/vod'
import { formatTime } from '../../utils/commonUtils'

const useVODHLSContext = () => React.useContext(VODHLSContext.Context)

export interface VODHLSPlaybackReelRef {
  setVolume(value: number): any
}

interface VODHLSPlaybackReelProps {
  style: any
}

const VODHLSPlaybackReel = React.forwardRef((props: VODHLSPlaybackReelProps, ref: React.Ref<VODHLSPlaybackReelRef>) => {
  const { style } = props

  React.useImperativeHandle(ref, () => ({ setVolume }))

  const vodState = useRecoilValue(vodPlaybackState)

  const { vod, assumeDriverControl, releaseDriverControl, setDrivenSeekTime, setSelectedItem, setIsPlaying } =
    useVODHLSContext()

  let totalLoad = 0

  const { classes } = useStyles()
  const [timeValue, setTimeValue] = React.useState<number>(0)
  const [volume, setVideoVolume] = React.useState<number>(1)

  const playerRefs = React.useMemo(
    () =>
      Array(vodState.list.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const thumbnailRefs = React.useMemo(
    () =>
      Array(vodState.list.length)
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
    // seek time comes in seconds
    // we determine offset in milliseconds
    console.log('[help]::seek time', vodState.seekTime, vodState)
    const { seekTime, isPlaying, updateTs } = vodState
    let seekTo = seekTime
    if (isPlaying) {
      const now = new Date().getTime()
      console.log('[help]::seek offset', now - updateTs, updateTs)
      const offset = now - updateTs
      seekTo = seekTime + offset / 1000
    }
    // playerRefs.forEach((ref) => {
    //   ;((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(seekTo, isPlaying)
    // })
    // timeValue should be updated based on seek()
  }, [vodState.seekTime, vodState.isPlaying])

  React.useEffect(() => {
    console.log('[help]::is playing', vodState.isPlaying, vodState)
    // if (vodState.isPlaying) {
    //   playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).play())
    // } else {
    //   playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).pause(true))
    // }
  }, [vodState.isPlaying])

  React.useEffect(() => {
    console.log('[help]::selection', vodState.selection, vodState)
    // updateSelection(vodState.selection)
  }, [vodState.selection])

  const updateSelection = (selectedItem: any) => {
    playerRefs.forEach((ref) => {
      const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
      player.show(player.hasItem(selectedItem))
    })
  }

  const screencast = () => {
    thumbnailRefs.forEach((ref) => {
      const tRef = ref as RefObject<VODHLSThumbnailRef>
      if (tRef && tRef.current) {
        ;(tRef.current as VODHLSThumbnailRef).redraw()
      }
    })
  }

  const itemIsSelected = (item: VODHLSItem) => {
    return vodState.selection && vodState.selection.filename === item.filename
  }

  // Can't use vodState here for some reason. Though it is updated, here it is stale?
  const checkLoad = () => {
    if (++totalLoad >= vodState.list.length) {
      let totalTime = -1
      playerRefs.forEach(async (ref) => {
        const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
        const duration = player.getDuration()
        totalTime = totalTime === -1 ? duration : Math.max(totalTime, duration)
      })
      setMaxTime(totalTime)
    }
  }

  const setVolume = (value: number) => {
    setVideoVolume(value)
  }

  const onHLSTimeUpdate = (index: number, item: VODHLSItem, time: number) => {
    if (itemIsSelected(item)) {
      // console.log('[help]:scrub', time)
      setTimeValue(time)
    }
  }

  const onPlayRequest = () => {
    setDrivenSeekTime(timeValue)
    setIsPlaying(!vodState.isPlaying, true)
  }

  const onHLSLoad = (index: number, item: VODHLSItem, totalTime: number) => {
    // Assign and watch thumbnails.
    const thumbnail = thumbnailRefs.find((ref) =>
      ((ref as RefObject<VODHLSThumbnailRef>).current as VODHLSThumbnailRef).hasItem(item)
    )
    const playerRef = playerRefs[index] as RefObject<VODHLSPlayerRef>
    if (thumbnail && playerRef) {
      ;(thumbnail.current as VODHLSThumbnailRef).watch(playerRef.current as VODHLSPlayerRef)
    }
    requestAnimationFrame(checkLoad)
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setTimeValue(newValue)
      setDrivenSeekTime(newValue)
      console.log('[help]:change', newValue, maxTime)
      assumeDriverControl()
      playerRefs.forEach(async (ref) => {
        const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
        if (player) {
          player.syncTime(newValue)
        }
      })
      // playerRefs.forEach((ref) =>
      //   ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(newValue, vodState.isPlaying)
      // )
    }
  }

  const onSliderRelease = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setTimeValue(newValue)
      setDrivenSeekTime(newValue)
      playerRefs.forEach(async (ref) => {
        const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
        if (player) {
          player.syncTime(newValue)
        }
      })
    }
    releaseDriverControl()
  }

  const onThumbnailSelect = (item: VODHLSItem) => {
    setDrivenSeekTime(timeValue)
    setSelectedItem(item, true)
  }

  return (
    <Box className={classes.container} sx={style}>
      <Stack className={classes.videoStack}>
        {new Array(vodState.list.length).fill(0).map((inp, index) => (
          <VODHLSPlayer
            key={`vod_${index}`}
            ref={playerRefs[index] as RefObject<VODHLSPlayerRef>}
            index={index}
            item={vodState.list[index]}
            volume={volume || 1}
            isPlaying={vodState.isPlaying}
            selectedItem={vodState.selection}
            seekTime={vodState.seekTime}
            onTimeUpdate={onHLSTimeUpdate}
            onHLSLoad={onHLSLoad}
          ></VODHLSPlayer>
        ))}
        {!vodState.isPlaying && (
          <Button
            disabled={!vodState.enabled}
            className={classes.playButton}
            style={{ display: vodState.driver ? 'none' : 'unset' }}
            color="inherit"
            onClick={onPlayRequest}
          >
            <PlayCircleOutlineIcon className={classes.playIcon} />
          </Button>
        )}
      </Stack>
      <Stack direction="column" gap={0} className={classes.thumbnailControlsContainer}>
        <Stack direction="row" gap={2} className={classes.thumbnailReel}>
          {new Array(vodState.list.length).fill(0).map((inp, index) => (
            <VODHLSThumbnail
              sx={{
                flexGrow: 1,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
              key={`thumbnail_${index}`}
              ref={thumbnailRefs[index] as RefObject<VODHLSThumbnailRef>}
              vodHLSItem={vodState.list[index]}
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
            disabled={typeof vodState.driver !== 'undefined' || !vodState.enabled || maxTime === 0}
            orientation="horizontal"
            defaultValue={0}
            aria-label="Playback Time"
            valueLabelDisplay="auto"
            valueLabelFormat={formatTime}
            min={0}
            max={maxTime}
            step={0.5}
            value={timeValue}
            onChange={onSliderChange}
            onChangeCommitted={onSliderRelease}
          />
          {vodState.isPlaying && (
            <Button className={classes.pauseButton} color="inherit" onClick={onPlayRequest}>
              <PauseCircleOutlineIcon className={classes.pauseIcon} />
            </Button>
          )}
        </Stack>
        {vodState.driver && (
          <Typography className={classes.driverControl}>{vodState.driver.name} is currently in control.</Typography>
        )}
      </Stack>
    </Box>
  )
})

VODHLSPlaybackReel.displayName = 'VODHLSPlaybackReel'
export default VODHLSPlaybackReel
