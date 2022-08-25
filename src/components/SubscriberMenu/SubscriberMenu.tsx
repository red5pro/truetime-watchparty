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
import MoreMenuIcon from '../Common/MoreMenuIcon/MoreMenuIcon'
import useStyles from './SubscriberMenu.module'
import { Block, Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'

interface SubscriberMenuProps {
  participant?: Participant
  actions?: any
}

const SubscriberMenu = (props: SubscriberMenuProps) => {
  const { actions, participant } = props

  const { classes } = useStyles()

  let closeTimeout: any
  const closeRef = React.useRef(null)

  const [showMenu, setShowMenu] = React.useState<boolean>(false)

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

  const onToggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const toggleMuteAudio = () => {
    onToggleMenu()
  }

  const toggleMuteVideo = () => {
    onToggleMenu()
  }

  const ban = () => {
    onToggleMenu()
  }

  return (
    <Stack sx={{ position: 'relative' }}>
      <IconButton color="primary" aria-label="subscriber menu" component="label" onClick={onToggleMenu}>
        <MoreMenuIcon />
      </IconButton>
      <Fade in={showMenu}>
        <List className={classes.listContainer}>
          <ListItemButton onClick={toggleMuteAudio}>
            <ListItemIcon className={classes.listItemIcon}>
              {!participant?.muteState.audioMuted && <Mic sx={{ color: 'white' }} />}
              {participant?.muteState.audioMuted && <MicOff sx={{ color: 'white' }} />}
            </ListItemIcon>
            <ListItemText primary={!participant?.muteState.audioMuted ? 'Mute Audio' : 'Unmute Audio'} />
          </ListItemButton>
          <Divider className={classes.listDivider} />
          <ListItemButton onClick={toggleMuteVideo}>
            <ListItemIcon className={classes.listItemIcon}>
              {!participant?.muteState.videoMuted && <Videocam sx={{ color: 'white' }} />}
              {participant?.muteState.videoMuted && <VideocamOff sx={{ color: 'white' }} />}
            </ListItemIcon>
            <ListItemText primary={!participant?.muteState.videoMuted ? 'Mute Video' : 'Unmute Video'} />
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
