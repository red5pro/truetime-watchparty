import { Box, Fade, List, ListItemButton, ListItemText, Paper, Stack } from '@mui/material'
import React from 'react'
import useOutsideClick from '../../hooks/useOutsideClick'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import useStyles from './MediaControl.module'

export interface MediaControlOption {
  name: string
  value: any
}

interface MediaControlProps {
  icon: React.ReactNode
  options: [MediaControlOption]
  onChange(select: MediaControlOption): any
  value: any
}

const MediaControl = (props: MediaControlProps) => {
  const { icon, options, value, onChange } = props

  const { classes } = useStyles()

  const ref = React.useRef()

  const [open, setOpen] = React.useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0)

  useOutsideClick(ref, () => setOpen(false))

  React.useEffect(() => {
    if (value && options) {
      const index = options.findIndex((o: MediaControlOption) => o.value === value)
      if (index > -1) {
        setSelectedIndex(index)
      }
    }
  }, [value, options])

  const toggleOpen = () => {
    setOpen(!open)
  }

  const onSelect = (selection: MediaControlOption, index: number) => {
    onChange(selection)
    setSelectedIndex(index)
    setOpen(false)
  }

  return (
    <Stack direction="column" className={classes.root}>
      <Box ref={ref} sx={{ width: 'fit-content' }}>
        <CustomButton
          className={classes.button}
          labelStyle={classes.buttonLabel}
          size={BUTTONSIZE.SMALL}
          buttonType={BUTTONTYPE.TRANSPARENT}
          startIcon={icon}
          onClick={toggleOpen}
        >
          {options && options.length > selectedIndex ? options[selectedIndex].name : 'N/A'}
        </CustomButton>
      </Box>
      {open && (
        <Fade in={open}>
          <Paper className={classes.listContainer} style={{ maxHeight: 200, overflow: 'auto' }}>
            <List>
              {options.map((o: MediaControlOption, i: number) => {
                return (
                  <ListItemButton
                    key={`option_${i}`}
                    onClick={() => onSelect(o, i)}
                    sx={i < options.length - 1 ? { borderBottom: '1px solid gray' } : {}}
                  >
                    <ListItemText>{o.name}</ListItemText>
                  </ListItemButton>
                )
              })}
            </List>
          </Paper>
        </Fade>
      )}
    </Stack>
  )
}

export default MediaControl
