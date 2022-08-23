import { Box, IconButton, Slider, Stack } from '@mui/material'
import VolumeUp from '@mui/icons-material/VolumeUp'
import React from 'react'

interface VolumeControlProps {
  isOpen: boolean
  min: number
  max: number
  step: number
  currentValue: number
  onVolumeChange(value: number): any
}

const VolumeControl = (props: VolumeControlProps) => {
  const { isOpen, min, max, step, currentValue, onVolumeChange } = props

  const [isSliderShown, setIsSliderShown] = React.useState<boolean>(isOpen)
  const [value, setValue] = React.useState<number>(currentValue)

  React.useEffect(() => {
    onVolumeChange(value)
  }, [value])

  const preventHorizontalKeyboardNavigation = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
    }
  }

  const toggleOpen = () => {
    setIsSliderShown(!isSliderShown)
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue)
    }
  }

  return (
    <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
      {isSliderShown && (
        <Box sx={{ height: 120, position: 'absolute', bottom: 60 }}>
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: 'slider-vertical',
              },
            }}
            orientation="vertical"
            defaultValue={30}
            aria-label="Temperature"
            valueLabelDisplay="auto"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onSliderChange}
            onKeyDown={preventHorizontalKeyboardNavigation}
          />
        </Box>
      )}
      <IconButton
        sx={{ marginTop: '0!important' }}
        color="primary"
        aria-label="change volume"
        component="label"
        onClick={toggleOpen}
      >
        <VolumeUp />
      </IconButton>
    </Stack>
  )
}

export default VolumeControl
