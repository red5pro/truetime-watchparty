import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import useStyles from './AddCoHostModal.module'
import AddCohostForm from '../../MainStage/Forms/AddCohostForm'
import JoinContext from '../../JoinContext/JoinContext'

const useJoinContext = () => React.useContext(JoinContext.Context)

interface AddCoHostsModalProps {
  open: boolean
  conferenceId: string | number
  onDismiss(): any
}

const AddCoHostsModal = (props: AddCoHostsModalProps) => {
  const { open, conferenceId, onDismiss } = props

  const { classes } = useStyles()
  const { addCoHostList, cohostsList } = useJoinContext()

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
              Add CoHosts to this Webinar!
            </Typography>
            {cohostsList.length > 0 && (
              <>
                <Typography
                  variant="subtitle1"
                  textAlign="left"
                  marginLeft="32px"
                  marginY={1}
                  className={classes.subtitle}
                >
                  Current CoHosts:
                </Typography>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 200,
                    marginLeft: '32px',
                    border: 'solid 1px white',
                    '& ul': { padding: 0 },
                  }}
                >
                  {cohostsList.map((email: string) => (
                    <ListItem key={`${email}`}>
                      <ListItemText primary={`${email}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <AddCohostForm conferenceId={conferenceId.toString()} addCoHostList={addCoHostList} onClose={onDismiss} />
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default AddCoHostsModal
