import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useStyles from './SimpleAlertDialog.module'

interface SimpleAlertDialogProps {
  title: string
  message: string
  confirmLabel?: string
  denyLabel?: string
  onConfirm(): boolean | undefined
  onDeny?(): boolean | undefined
}

const SimpleAlertDialog = (props: SimpleAlertDialogProps) => {
  const { title, message, confirmLabel, denyLabel, onConfirm, onDeny } = props
  const { classes } = useStyles()
  const [open, setOpen] = React.useState<boolean>(true)

  const close = () => {
    setOpen(false)
  }

  const onConfirmClick = () => {
    close()
    return onConfirm()
  }

  const onDenyClick = () => {
    close()
    if (onDeny) return onDeny()
    return true
  }

  return (
    <Dialog
      open={open}
      // onClose={close}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.title}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {onDeny && (
          <Button className={classes.button} onClick={onDenyClick}>
            {denyLabel || 'Disagree'}
          </Button>
        )}
        <Button className={classes.button} onClick={onConfirmClick} autoFocus>
          {confirmLabel || 'Agree'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SimpleAlertDialog
