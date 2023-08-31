/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { Box, Fade, IconButton, Slider, Stack } from '@mui/material'
import VolumeUp from '@mui/icons-material/VolumeUp'
import React from 'react'
import useOutsideClick from '../../hooks/useOutsideClick'

interface VolumeControlProps {
  isOpen: boolean
  min: number
  max: number
  step: number
  currentValue: number
  position?: string
  onVolumeChange(value: number): any
}

const VolumeControl = (props: VolumeControlProps) => {
  const { isOpen, min, max, step, currentValue, position, onVolumeChange } = props

  let closeTimeout: any
  const closeRef = React.useRef(null)

  const [isSliderShown, setIsSliderShown] = React.useState<boolean>(isOpen)
  const [value, setValue] = React.useState<number>(currentValue)

  React.useEffect(() => {
    onVolumeChange(value)
    resetCloseTimeout()
  }, [value])

  React.useEffect(() => {
    stopCloseTimeout()
    if (isSliderShown) {
      resetCloseTimeout()
    }
  }, [isSliderShown])

  const preventHorizontalKeyboardNavigation = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
    }
  }

  const stopCloseTimeout = () => {
    if (closeRef.current) {
      clearTimeout(closeRef.current)
    }
    clearTimeout(closeTimeout)
  }

  const resetCloseTimeout = () => {
    stopCloseTimeout()
    closeTimeout = setTimeout(() => {
      toggleOpen()
    }, 4000)
    closeRef.current = closeTimeout
  }

  const toggleOpen = () => {
    stopCloseTimeout()
    setIsSliderShown(!isSliderShown)
  }

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue)
    }
  }

  return (
    <Stack
      spacing={2}
      direction={position === 'horizontal' ? 'row' : 'column'}
      alignItems="center"
      justifyContent="center"
      sx={{ position: 'relative' }}
    >
      <Fade in={isSliderShown}>
        <Box sx={position === 'horizontal' ? { width: 120 } : { height: 120, position: 'absolute', bottom: 60 }}>
          <Slider
            sx={{
              zIndex: 500,
              '& input[type="range"]': {
                WebkitAppearance: position === 'horizontal' ? 'slider-horizontal' : 'slider-vertical',
              },
            }}
            orientation={position === 'horizontal' ? 'horizontal' : 'vertical'}
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
      </Fade>
      <IconButton
        sx={{ marginTop: '0!important', backdropFilter: 'contrast(0.5)' }}
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
