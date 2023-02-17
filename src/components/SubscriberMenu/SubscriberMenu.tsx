import React from 'react'
import {
  Button,
  Divider,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
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
}

const SubscriberMenu = (props: SubscriberMenuProps) => {
  const { actions, participant } = props

  const { classes } = useStyles()

  let closeTimeout: any
  const closeRef = React.useRef(null)

  const ref = React.useRef(null)
  const menuRef = React.useRef(null)

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
      ;(menuRef.current as any).style.left = `${event.screenX + 24}px`
      // ;(menuRef.current as any).style.top = `${event.screenY - 6}px`
      setMenuOffset(event.screenX + 24)
      setShowMenu(!showMenu)
    }
  }

  const toggleMuteAudio = () => {
    const muted = participant.muteState?.audioMuted
    actions?.onMuteAudio(participant, !muted)
    onToggleMenu()
  }

  const toggleMuteVideo = () => {
    const muted = participant.muteState?.audioMuted
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
          <ListItemButton onClick={toggleMuteAudio}>
            <ListItemIcon className={classes.listItemIcon}>
              {!participant.muteState?.audioMuted && <Mic sx={{ color: 'white' }} />}
              {participant.muteState?.audioMuted && <MicOff sx={{ color: 'white' }} />}
            </ListItemIcon>
            <ListItemText primary={!participant.muteState?.audioMuted ? 'Mute Audio' : 'Unmute Audio'} />
          </ListItemButton>
          <Divider className={classes.listDivider} />
          <ListItemButton onClick={toggleMuteVideo}>
            <ListItemIcon className={classes.listItemIcon}>
              {!participant.muteState?.videoMuted && <Videocam sx={{ color: 'white' }} />}
              {participant.muteState?.videoMuted && <VideocamOff sx={{ color: 'white' }} />}
            </ListItemIcon>
            <ListItemText primary={!participant.muteState?.videoMuted ? 'Mute Video' : 'Unmute Video'} />
          </ListItemButton>
          <Divider className={classes.listDivider} />
          <ListItemButton onClick={ban}>
            <ListItemIcon className={classes.listItemIcon}>
              <Block sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Ban" />
          </ListItemButton>
        </List>
      </Fade>
    </Stack>
  )
}

export default SubscriberMenu
