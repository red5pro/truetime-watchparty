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
/* eslint-disable no-prototype-builtins */
import React from 'react'
import { Divider, Fade, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
import { Participant } from '../../models/Participant'
import MoreMenuIcon from '../../assets/MoreMenuIcon/MoreMenuIcon'
import useStyles from './SubscriberMenu.module'
import { Block, Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'
import useOutsideClick from '../../hooks/useOutsideClick'

interface SubscriberMenuActions {
  onMuteAudio(participant: Participant, requestMute: boolean): any
  onMuteVideo(participant: Participant, requestMute: boolean): any
  onBan(participant: Participant): any
}

interface SubscriberMenuProps {
  participant: Participant
  actions: SubscriberMenuActions
  isFullscreen?: boolean
}

const SubscriberMenu = (props: SubscriberMenuProps) => {
  const { actions, participant, isFullscreen } = props

  const { classes } = useStyles()

  let closeTimeout: any
  const closeRef = React.useRef(null)

  const ref = React.useRef(null)
  const menuRef = React.useRef<any>(null)

  const [menuOffset, setMenuOffset] = React.useState<number>(24)
  const [showMenu, setShowMenu] = React.useState<boolean>(false)

  useOutsideClick(ref, () => setShowMenu(false))

  React.useEffect(() => {
    stopCloseTimeout()
    if (showMenu) {
      resetCloseTimeout()
    }
  }, [showMenu])

  const stopCloseTimeout = () => {
    if (closeRef.current) {
      clearTimeout(closeRef.current)
    }
    clearTimeout(closeTimeout)
  }

  const resetCloseTimeout = () => {
    stopCloseTimeout()
    closeTimeout = setTimeout(() => {
      onToggleMenu()
    }, 4000)
    closeRef.current = closeTimeout
  }

  const onToggleMenu = (event?: any) => {
    if (event && menuRef && menuRef.current) {
      const menuOffsetX = isFullscreen ? event.screenX - 190 : event.screenX + 24

      menuRef.current.style.left = `${menuOffsetX}px`
      menuRef.current.style.top = `${event.screenY - 150}px`

      setMenuOffset(menuOffsetX)
      setShowMenu(!showMenu)
    }
  }

  const toggleMuteAudio = () => {
    const muted = participant.muteState?.audioMuted
    actions?.onMuteAudio(participant, !muted)
    onToggleMenu()
  }

  const toggleMuteVideo = () => {
    const muted = participant.muteState?.videoMuted
    actions?.onMuteVideo(participant, !muted)
    onToggleMenu()
  }

  const ban = () => {
    actions?.onBan(participant)
    onToggleMenu()
  }

  return (
    <Stack className={classes.root}>
      <IconButton ref={ref} color="primary" aria-label="subscriber menu" component="label" onClick={onToggleMenu}>
        <MoreMenuIcon />
      </IconButton>
      <Fade in={showMenu}>
        <List
          ref={menuRef}
          className={classes.listContainer}
          sx={{ position: 'fixed', left: `${menuOffset}px!important` }}
        >
          {Object(actions)?.hasOwnProperty('onMuteAudio') && (
            <>
              <ListItemButton onClick={toggleMuteAudio}>
                <ListItemIcon className={classes.listItemIcon}>
                  {!participant.muteState?.audioMuted && <Mic sx={{ color: 'white' }} />}
                  {participant.muteState?.audioMuted && <MicOff sx={{ color: 'white' }} />}
                </ListItemIcon>
                <ListItemText primary={!participant.muteState?.audioMuted ? 'Mute Audio' : 'Unmute Audio'} />
              </ListItemButton>
              <Divider className={classes.listDivider} />
            </>
          )}
          {Object(actions)?.hasOwnProperty('onMuteVideo') && (
            <>
              <ListItemButton onClick={toggleMuteVideo}>
                <ListItemIcon className={classes.listItemIcon}>
                  {!participant.muteState?.videoMuted && <Videocam sx={{ color: 'white' }} />}
                  {participant.muteState?.videoMuted && <VideocamOff sx={{ color: 'white' }} />}
                </ListItemIcon>
                <ListItemText primary={!participant.muteState?.videoMuted ? 'Mute Video' : 'Unmute Video'} />
              </ListItemButton>
              <Divider className={classes.listDivider} />
            </>
          )}
          {Object(actions)?.hasOwnProperty('onBan') && (
            <>
              <ListItemButton onClick={ban}>
                <ListItemIcon className={classes.listItemIcon}>
                  <Block sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Ban" />
              </ListItemButton>
            </>
          )}
        </List>
      </Fade>
    </Stack>
  )
}

export default SubscriberMenu
