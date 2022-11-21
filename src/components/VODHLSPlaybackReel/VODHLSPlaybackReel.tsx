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
import SimpleAlertDialog from '../Modal/SimpleAlertDialog'
import styles from './VODHLSPlaybackLayout'
import { Layout } from '../../models/Layout'

const useVODHLSContext = () => React.useContext(VODHLSContext.Context)

export interface VODHLSPlaybackReelRef {
  setVolume(value: number): any
}

interface VODHLSPlaybackReelProps {
  layout: Layout
  onAlert(data: any): any
  onFatalError(data: any): any
}

const VODHLSPlaybackReel = React.forwardRef((props: VODHLSPlaybackReelProps, ref: React.Ref<VODHLSPlaybackReelRef>) => {
  const { layout, onAlert, onFatalError } = props

  React.useImperativeHandle(ref, () => ({ setVolume }))

  const vodState = useRecoilValue(vodPlaybackState)

  const {
    assumeDriverControl,
    releaseDriverControl,
    setDrivenSeekTime,
    setCurrentPlayHead,
    setSelectedItem,
    setIsPlaying,
  } = useVODHLSContext()

  let totalLoad = 0

  const { classes } = useStyles()
  const [timeValue, setTimeValue] = React.useState<number>(0)
  const [volume, setVideoVolume] = React.useState<number>(1)
  const [vodLayout, setVODLayout] = React.useState<any>(styles.stage)
  const [maxTime, setMaxTime] = React.useState<number>(0)

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
    let useLayout: any = styles.stage
    if (layout === Layout.FULLSCREEN) {
      useLayout = styles.fullscreen
    } else if (layout === Layout.EMPTY) {
      useLayout = styles.empty
    }
    setVODLayout(useLayout)
  }, [layout])

  React.useEffect(() => {
    playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).setVolume(volume))
  }, [volume])

  const screencast = () => {
    thumbnailRefs.forEach((ref) => {
      const tRef = ref as RefObject<VODHLSThumbnailRef>
      if (tRef && tRef.current) {
        ;(tRef.current as VODHLSThumbnailRef).redraw()
      }
    })
  }

  // Can't use vodState here for some reason. Though it is updated, here it is stale?
  const checkLoad = () => {
    if (++totalLoad >= vodState.list.length) {
      let totalTime = -1
      playerRefs.forEach((ref) => {
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
    // console.log(`[help] Following ${index}, with value ${time}.`)
    setTimeValue(time)
    setCurrentPlayHead(time)
  }

  const onPlayRequest = () => {
    setDrivenSeekTime(timeValue, false)
    setIsPlaying(!vodState.isPlaying, timeValue, true)
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
    // console.log('[loaded]', index, item, totalTime)
    requestAnimationFrame(checkLoad)
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setTimeValue(newValue)
      setDrivenSeekTime(newValue, true)
      assumeDriverControl()
      playerRefs.forEach(async (ref) => {
        const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
        if (player) {
          player.syncTime(newValue)
        }
      })
    }
  }

  const onSliderRelease = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setTimeValue(newValue)
      setDrivenSeekTime(newValue, true)
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
    setDrivenSeekTime(timeValue, true)
    setSelectedItem(item, timeValue, true)
  }

  // Needed for mobile safari and its silly user-interaction over autoplay...
  const onPlaybackRestriction = () => {
    onAlert({
      title: 'Sync',
      statusText: 'Would you like to begin synchronize playback?',
      confirmLabel: 'OK',
      onConfirm: onPlaybackRestrictionConfirm,
    })
  }

  const onHLSFatalError = (index: number, item: VODHLSItem, error: string) => {
    onFatalError({
      title: 'Stream Load Error',
      statusText: error,
      closeLabel: 'Reload',
      onClose: () => {
        window.location.reload()
      },
    })
  }

  const onPlaybackRestrictionConfirm = () => {
    playerRefs.forEach(async (ref) => {
      const player = (ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef
      if (player) {
        player.play()
      }
    })
  }

  return (
    <Box className={classes.container} sx={vodLayout.container}>
      <Stack className={classes.videoStack} sx={vodLayout.stack}>
        {new Array(vodState.list.length).fill(0).map((inp, index) => (
          <VODHLSPlayer
            sx={vodLayout.vodPlayer}
            key={`vod_${index}`}
            ref={playerRefs[index] as RefObject<VODHLSPlayerRef>}
            index={index}
            item={vodState.list[index]}
            volume={volume || 1}
            isPlaying={vodState.isPlaying}
            // selectedItem={vodState.selection}
            seekTime={vodState.seekTime}
            onTimeUpdate={onHLSTimeUpdate}
            onHLSLoad={onHLSLoad}
            onHLSFatalError={onHLSFatalError}
            onPlaybackRestriction={onPlaybackRestriction}
          ></VODHLSPlayer>
        ))}
        {!vodState.isPlaying && (
          <Button
            disabled={!vodState.enabled || maxTime === 0}
            className={classes.playButton}
            style={{
              display: vodState.driver ? 'none' : 'unset',
              backgroundColor: 'unset',
            }}
            color="inherit"
            onClick={onPlayRequest}
          >
            <PlayCircleOutlineIcon className={classes.playIcon} />
          </Button>
        )}
      </Stack>
      <Stack
        direction="column"
        gap={0}
        className={classes.thumbnailControlsContainer}
        sx={vodLayout.thumbnailContainer}
      >
        <Stack direction="row" gap={2} className={classes.thumbnailReel} sx={vodLayout.reel}>
          {new Array(vodState.list.length).fill(0).map((inp, index) => (
            <VODHLSThumbnail
              sx={vodLayout.thumbnail}
              key={`thumbnail_${index}`}
              ref={thumbnailRefs[index] as RefObject<VODHLSThumbnailRef>}
              vodHLSItem={vodState.list[index]}
              onSelect={onThumbnailSelect}
            ></VODHLSThumbnail>
          ))}
        </Stack>
        <Stack direction="row" gap={1} className={classes.controls} sx={vodLayout.controls}>
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
            <Button
              className={classes.pauseButton}
              color="inherit"
              style={{
                display: vodState.driver ? 'none' : 'unset',
                backgroundColor: 'unset',
              }}
              onClick={onPlayRequest}
              disabled={typeof vodState.driver !== 'undefined'}
            >
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
