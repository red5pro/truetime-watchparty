import React from 'react'
import { IconButton, Stack } from '@mui/material'
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

  const { classes } = useStyles()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const toggleSelect = () => {
    setIsOpen(!isOpen)
  }

  const onMenuSelect = (selection: number) => {
    setIsOpen(false)
    if (layout === selection) return
    onSelect(selection)
  }

  return (
    <Stack direction="column" alignItems="center" sx={{ position: 'relative' }}>
      {isOpen && (
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
      )}
      {layout === Layout.STAGE && (
        <IconButton color="primary" aria-label="stage layout" component="label" onClick={toggleSelect}>
          <LayoutIconStage />
        </IconButton>
      )}
      {layout === Layout.FULLSCREEN && (
        <IconButton color="primary" aria-label="stage layout" component="label" onClick={toggleSelect}>
          <LayoutIconFullscreen />
        </IconButton>
      )}
      {layout === Layout.EMPTY && (
        <IconButton color="primary" aria-label="stage layout" component="label" onClick={toggleSelect}>
          <LayoutIconEmpty />
        </IconButton>
      )}
    </Stack>
  )
}

export default MainStageLayoutSelect
