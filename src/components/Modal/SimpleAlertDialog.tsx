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
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useStyles from './SimpleAlertDialog.module'

export interface SimpleAlertDialogProps {
  title: string
  message: string
  confirmLabel?: string
  denyLabel?: string
  onConfirm(): boolean | void
  onDeny?(): boolean | void
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
