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
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { Link as LinkTo } from 'react-router-dom'
import { Box, Input, Link, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import useStyles from './ShareLinkModal.module'

interface ShareLinkModalProps {
  open: boolean
  joinToken: string
  onDismiss(): any
}

const ShareLinkModal = (props: ShareLinkModalProps) => {
  const { open, joinToken, onDismiss } = props

  const { classes } = useStyles()

  const textLinkRef = React.useRef<HTMLInputElement>(null)
  const linkToCopy = `${location.origin}/join/${joinToken}`

  const [textCopied, setTextCopied] = React.useState<boolean>(false)

  const copyToClipboard = () => {
    textLinkRef.current?.focus()
    textLinkRef.current?.select

    if (!navigator.clipboard) {
      document.execCommand('copy', true, linkToCopy)
    } else {
      navigator.clipboard.writeText(linkToCopy)
    }

    setTextCopied(true)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      onClose={onDismiss}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
          <Box display="flex" flexDirection="column" className={classes.container}>
            <Typography textAlign="center" marginY={1} className={classes.title}>
              Share with your friends!
            </Typography>
            <Box display="flex" className={classes.buttonsContainer}>
              <CustomButton startIcon={<FacebookIcon />} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.FACEBOOK}>
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${linkToCopy}&display=page`} target="_blank">
                  Share on Facebook
                </Link>
              </CustomButton>

              <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY} onClick={copyToClipboard}>
                Copy link
              </CustomButton>
            </Box>
            <Box display={textCopied ? 'block' : 'none'} marginY={2}>
              <Typography className={classes.subtitle}>Link copied!</Typography>
              <Input ref={textLinkRef} value={linkToCopy} defaultValue={linkToCopy} sx={{ width: '100%' }} />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ShareLinkModal
