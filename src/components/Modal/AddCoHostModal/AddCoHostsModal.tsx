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
import Modal from '@mui/material/Modal'
import { Box, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import useStyles from './AddCoHostModal.module'
import AddCohostForm from '../../MainStage/Forms/AddCohostForm'
import JoinContext from '../../JoinContext/JoinContext'
import Loading from '../../Common/Loading/Loading'
import { SimpleAlertDialogProps } from '../SimpleAlertDialog'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { UserRoles } from '../../../utils/commonUtils'
const SimpleAlertDialog = React.lazy(() => import('../SimpleAlertDialog'))

const useJoinContext = () => React.useContext(JoinContext.Context)

interface AddCoHostsModalProps {
  open: boolean
  conferenceId: string | number
  onDismiss(): any
}

const AddCoHostsModal = (props: AddCoHostsModalProps) => {
  const { open, conferenceId, onDismiss } = props

  const [error, setError] = React.useState<any>(null)
  const [createNewAccount, setCreateNewAccount] = React.useState<string | null>(null)
  const [addNewAccountToList, setAddNewAccountToList] = React.useState<string | null>(null)

  const [success, setSuccess] = React.useState<SimpleAlertDialogProps | null>(null)

  const { classes } = useStyles()
  const { updateCoHostList, cohostsList, getCoHostsList } = useJoinContext()

  React.useEffect(() => {
    if (conferenceId) {
      getCoHostsList(conferenceId)
    }
  }, [])

  React.useEffect(() => {
    if (createNewAccount) {
      createCohostAccount(createNewAccount)
    }
  }, [createNewAccount])

  React.useEffect(() => {
    if (addNewAccountToList) {
      handleSubmit({ email: addNewAccountToList })
    }
  }, [addNewAccountToList])

  const onDeleteCoHost = async (email: string) => {
    for (let i = 0; i < cohostsList.length; i++) {
      if (cohostsList[i] === email) {
        cohostsList.splice(i, 1)
      }
    }
    const response = await updateCoHostList(conferenceId, cohostsList)

    if (response.status === 200) {
      const msg: SimpleAlertDialogProps = {
        title: `The Cohost has been deleted`,
        message: '',
        onConfirm: () => setSuccess(null),
      }
      setSuccess(msg)
    } else {
      setError({
        status: 'Warning',
        statusText: response.statusText ?? 'There was an error while deleting a cohost, please try again.',
      })
    }
  }

  const handleSubmit = async (values: any) => {
    const list = [...cohostsList, values.email]
    const response = await updateCoHostList(conferenceId, list)

    if (response.status === 200) {
      const msg: SimpleAlertDialogProps = {
        title: `The Cohost has been added`,
        message: 'Please share the conference url to the cohost.',
        onConfirm: () => setSuccess(null),
      }
      setSuccess(msg)
    } else if (response.status === 400 && response.statusText.includes('not found')) {
      const msg: SimpleAlertDialogProps = {
        title: `User Not Found`,
        message: `The email: ${values.email} was not found in our system. Do you want to sent an invite to this email to create the account?`,
        onConfirm: () => {
          setSuccess(null), setCreateNewAccount(values.email)
        },
        denyLabel: 'Cancel',
        onDeny: () => setSuccess(null),
      }
      setSuccess(msg)
    } else {
      setError({
        status: 'Warning',
        statusText: 'There was an error while adding the cohost, please try again.',
      })
    }
  }

  const createCohostAccount = async (email: string) => {
    const response = await USER_API_CALLS.createUser(email, UserRoles.ORGANIZER)

    if (response.status >= 200 && response.status < 300) {
      const msg: SimpleAlertDialogProps = {
        title: `The account for the Cohost with email ${email} has been created`,
        message:
          'The cohost will receive a link that has just been sent to the email account to verify the email, finish the account creation and join the conference.',
        onConfirm: () => {
          setSuccess(null)
          setCreateNewAccount(null)
          setAddNewAccountToList(email)
        },
      }
      setSuccess(msg)
    }
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      onClose={onDismiss}
    >
      <>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
          <Box display="flex" flexDirection="column" className={classes.container}>
            <Typography textAlign="center" marginY={1} className={classes.title}>
              Add CoHosts to this Webinar!
            </Typography>
            {cohostsList === undefined && <Loading />}
            {cohostsList?.length > 0 && (
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
                    maxWidth: 415,
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
                      <Tooltip title="Delete">
                        <IconButton
                          sx={{ backdropFilter: 'contrast(0.5)' }}
                          color="primary"
                          aria-label="share link"
                          component="label"
                          onClick={() => onDeleteCoHost(email)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <AddCohostForm conferenceId={conferenceId.toString()} handleSubmit={handleSubmit} onClose={onDismiss} />
          </Box>
        </Box>

        {success && (
          <SimpleAlertDialog
            title={success.title}
            message={success.message}
            confirmLabel="Ok"
            onConfirm={success.onConfirm}
            denyLabel={success.denyLabel}
            onDeny={success.onDeny}
          />
        )}
        {error && (
          <SimpleAlertDialog
            title="Something went wrong"
            message={`${error.status} - ${error.statusText}`}
            confirmLabel="Ok"
            onConfirm={() => setError(null)}
          />
        )}
      </>
    </Modal>
  )
}

export default AddCoHostsModal
