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
              <CustomButton
                fullWidth
                startIcon={<FacebookIcon />}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.FACEBOOK}
              >
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${linkToCopy}&display=page`} target="_blank">
                  Share on Facebook
                </Link>
              </CustomButton>

              <CustomButton
                fullWidth
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
                onClick={copyToClipboard}
              >
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
