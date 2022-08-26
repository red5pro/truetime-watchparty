import { Backdrop, Box, Button, Fade, Modal, Stack, Typography } from '@mui/material'
import useStyles from './ErrorModal.module'

interface ErrorModalProps {
  open: boolean
  title: string
  message: string
  closeLabel: string
  onClose(): any
}

const ErrorModal = (props: ErrorModalProps) => {
  const { open, title, message, closeLabel, onClose } = props

  const { classes } = useStyles()

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
          <Stack direction="column" alignItems="center" className={classes.container}>
            <Typography className={classes.title}>{title}</Typography>
            <Typography className={classes.message}>{message}</Typography>
            <Button className={classes.closeButton} onClick={onClose}>
              {closeLabel}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ErrorModal
