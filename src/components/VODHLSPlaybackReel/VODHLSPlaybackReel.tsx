import React, { RefObject } from 'react'
import { Box, Slider, Stack } from '@mui/material'
import { VODHLSItem } from '../../models/VODHLSItem'
import VODHLSPlayer from './VODHLSPlayer'

import VODHLSContext from '../../components/VODHLSContext/VODHLSContext'
const useVODHLSContext = () => React.useContext(VODHLSContext.Context)

interface VODHLSPlayerRef {
  play(): any
  pause(resume: boolean): any
  seek(to: number, andPlay?: boolean): any
  destroy(): any
}

interface VODHLSPlaybackReelProps {
  style: any
  list: [VODHLSItem]
}

const VODHLSPlaybackReel = (props: VODHLSPlaybackReelProps) => {
  const { style, list } = props

  const { vod, setCurrentTime } = useVODHLSContext()

  const playerRefs = React.useMemo(
    () =>
      Array(list.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const [value, setValue] = React.useState<number>(0)
  const [maxTime, setMaxTime] = React.useState<number>(0)

  const onHLSLoad = (item: VODHLSItem, totalTime: number) => {
    if (totalTime > maxTime) {
      setMaxTime(totalTime)
    }
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue)
      setCurrentTime(newValue)
      playerRefs.forEach((ref) => ((ref as RefObject<VODHLSPlayerRef>).current as VODHLSPlayerRef).seek(newValue))
    }
  }

  return (
    <Stack sx={style} direction="column">
      <Stack direction="row" gap={2}>
        {new Array(list.length).fill(0).map((inp, index) => (
          <VODHLSPlayer
            sx={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
            }}
            key={`vod_${index}`}
            ref={playerRefs[index] as RefObject<VODHLSPlayerRef>}
            item={list[index]}
            onHLSLoad={onHLSLoad}
          ></VODHLSPlayer>
        ))}
      </Stack>
      <Box>
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
