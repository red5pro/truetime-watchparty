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
import React from 'react'
import { Fade, IconButton, Stack } from '@mui/material'
import LayoutIconEmpty from '../../assets/MainStageLayoutIcon/LayoutIconEmpty'
import LayoutIconFullscreen from '../../assets/MainStageLayoutIcon/LayoutIconFullscreen'
import LayoutIconStage from '../../assets/MainStageLayoutIcon/LayoutIconStage'
import useStyles from './MainStageLayoutSelect.module'

interface MainStageLayoutSelectProps {
  layout?: number
  onSelect(layout: number): any
}

enum Layout {
  STAGE = 1,
  FULLSCREEN,
  EMPTY,
}

const MainStageLayoutSelect = (props: MainStageLayoutSelectProps) => {
  const { layout, onSelect } = props

  let closeTimeout: any
  const closeRef = React.useRef(null)

  const { classes } = useStyles()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    stopCloseTimeout()
    if (isOpen) {
      resetCloseTimeout()
    }
  }, [isOpen])

  const toggleSelect = () => {
    setIsOpen(!isOpen)
  }

  const onMenuSelect = (selection: number) => {
    setIsOpen(false)
    if (layout === selection) return
    onSelect(selection)
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
      toggleSelect()
    }, 4000)
    closeRef.current = closeTimeout
  }

  return (
    <Stack direction="column" alignItems="center" sx={{ position: 'relative' }}>
      <Fade in={isOpen}>
        <Stack spacing={2} direction="row" className={classes.selectContainer}>
          <IconButton
            color="primary"
            aria-label="stage layout"
            component="label"
            onClick={() => onMenuSelect(Layout.STAGE)}
          >
            <LayoutIconStage />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="fullscreen layout"
            component="label"
            onClick={() => onMenuSelect(Layout.FULLSCREEN)}
          >
            <LayoutIconFullscreen />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="empty layout"
            component="label"
            onClick={() => onMenuSelect(Layout.EMPTY)}
          >
            <LayoutIconEmpty />
          </IconButton>
        </Stack>
      </Fade>
      {layout === Layout.STAGE && (
        <IconButton
          sx={{ backdropFilter: 'contrast(0.3)' }}
          color="primary"
          aria-label="stage layout"
          component="label"
          onClick={toggleSelect}
        >
          <LayoutIconStage />
        </IconButton>
      )}
      {layout === Layout.FULLSCREEN && (
        <IconButton
          sx={{ backdropFilter: 'contrast(0.3)' }}
          color="primary"
          aria-label="stage layout"
          component="label"
          onClick={toggleSelect}
        >
          <LayoutIconFullscreen />
        </IconButton>
      )}
      {layout === Layout.EMPTY && (
        <IconButton
          sx={{ backdropFilter: 'contrast(0.3)' }}
          color="primary"
          aria-label="stage layout"
          component="label"
          onClick={toggleSelect}
        >
          <LayoutIconEmpty />
        </IconButton>
      )}
    </Stack>
  )
}

export default MainStageLayoutSelect
