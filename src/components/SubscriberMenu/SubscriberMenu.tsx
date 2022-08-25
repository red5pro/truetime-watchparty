import React from 'react'
import { Button, Fade, IconButton, Stack } from '@mui/material'
import { Participant } from '../../models/Participant'
import MoreMenuIcon from '../Common/MoreMenuIcon/MoreMenuIcon'
import useStyles from './SubscriberMenu.module'

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

  return (
    <Stack>
      <IconButton color="primary" aria-label="subscriber menu" component="label" onClick={onToggleMenu}>
        <MoreMenuIcon />
      </IconButton>
      <Fade in={showMenu}>
        <Stack spacing={2} direction="row" className={classes.container}>
          <Button>Hello</Button>
        </Stack>
      </Fade>
    </Stack>
  )
}

export default SubscriberMenu
