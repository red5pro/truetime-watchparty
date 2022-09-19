import * as React from 'react'
import * as Yup from 'yup'
import { Box, FormLabel, LinearProgress, TextareaAutosize, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import useStyles from './CreateGuestAccount.module'
import { AccountCredentials } from '../../../models/AccountCredentials'
import useCookies from '../../../hooks/useCookies'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { UserRoles } from '../../../utils/commonUtils'

const initialValues = {
  conferenceId: 0,
  email: '',
  password: '',
  startTime: 0,
  endTime: 0,
  message: '',
}

const validationSchema = Yup.object().shape({
  conferenceId: Yup.string().required('Conference field is required'),
  email: Yup.string().email('Invalid Email').required('Email field is required'),
  password: Yup.string().max(50).required('Password field is required'),
  startTime: Yup.date(),
  endTime: Yup.date(),
  message: Yup.string().max(150).required('Message field is required'),
})

interface ICreateGuestAccount {
  backToPage: (value: boolean) => Promise<void>
}

const CreateGuestAccount = (props: ICreateGuestAccount) => {
  const { backToPage } = props

  const [error, setError] = React.useState<any>()

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])

  const handleSubmit = async (values: any) => {
    // TODO: save message with username, when the endpoint is ready.
    // TODO: add verification email step

    const { account } = getCookies()
    const cred: AccountCredentials = {
      email: account.username,
      password: account.password,
    }
    const createUserResponse = await USER_API_CALLS.createUser(values.email, values.password, UserRoles.VIP, cred)

    if (createUserResponse.status === 201) {
      await backToPage(true)
    } else {
      setError({
        status: `Error!`,
        statusText: `${createUserResponse.statusText}`,
      })
    }
  }

  const handleCancel = async () => await backToPage(true)

  return (
    <Box marginY={4} sx={{ position: 'relative', left: '15%' }}>
      <Typography variant="h4" fontWeight={600}>
        Invite New Special Guest
      </Typography>
      <Typography fontSize="18px" fontWeight={400} marginY={2}>
        Please add details for your invite
      </Typography>

      <>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => handleSubmit(values)}
          enableReinitialize
        >
          {(props: any) => {
            const { submitForm, isSubmitting, errors, touched, values, setFieldValue } = props

            return (
              <Form method="post">
                <Box display="flex" flexDirection="column" className={classes.container}>
                  <FormLabel color="primary">Special guest email</FormLabel>
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    placeholder="Email"
                    className={classes.input}
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    id="password"
                    name="password"
                    label="Password"
                    className={classes.input}
                    autoComplete="off"
                    fullWidth
                  />
                  <Field
                    component={TextareaAutosize}
                    label="Message in this Invite"
                    type="text"
                    placeholder="Message"
                    name="message"
                    className={`${classes.textField} ${
                      errors.message && touched.message ? classes.errorTextField : ''
                    }`}
                    onChange={(ev: any) => setFieldValue('message', ev?.target?.value)}
                    value={values.message}
                  />
                  {errors.message && touched.message && (
                    <Typography className={classes.errorValidation}>{errors.message}</Typography>
                  )}
                  <Box display="flex" justifyContent="space-around">
                    <CustomButton
                      disabled={isSubmitting}
                      onClick={submitForm}
                      size={BUTTONSIZE.MEDIUM}
                      buttonType={BUTTONTYPE.SECONDARY}
                      className={classes.signInButton}
                    >
                      Send
                    </CustomButton>
                    <CustomButton
                      disabled={isSubmitting}
                      onClick={handleCancel}
                      size={BUTTONSIZE.MEDIUM}
                      buttonType={BUTTONTYPE.TERTIARY}
                      className={classes.signInButton}
                    >
                      Cancel
                    </CustomButton>
                  </Box>
                  {isSubmitting && <LinearProgress />}
                </Box>
              </Form>
            )
          }}
        </Formik>
        {error && (
          <SimpleAlertDialog
            title="Something went wrong"
            message={`${error.status} - ${error.statusText}`}
            confirmLabel="Ok"
            onConfirm={() => setError(null)}
          />
        )}
      </>
    </Box>
  )
}

export default CreateGuestAccount
