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
  disabled: boolean
  onChange(select: MediaControlOption): any
  value: any
}

const MediaControl = (props: MediaControlProps) => {
  const { icon, options, disabled, value, onChange } = props

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
          disabled={disabled || !options || options.length <= 0}
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
