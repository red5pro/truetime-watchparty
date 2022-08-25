import React from 'react'
import { Fade, IconButton, Stack } from '@mui/material'
import LayoutIconEmpty from '../Common/MainStageLayoutIcon/LayoutIconEmpty'
import LayoutIconFullscreen from '../Common/MainStageLayoutIcon/LayoutIconFullscreen'
import LayoutIconStage from '../Common/MainStageLayoutIcon/LayoutIconStage'
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
