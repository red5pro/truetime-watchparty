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
  startTime: 0,
  endTime: 0,
  message: '',
}

const validationSchema = Yup.object().shape({
  conferenceId: Yup.string().required('Conference field is required'),
  email: Yup.string().email('Invalid Email').required('Email field is required'),
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

  //TODO: Remove "setCookie" when the token is sent by email to the customers
  const { getCookies, setCookie } = useCookies(['account', 'userToken'])

  const handleSubmit = async (values: any) => {
    // TODO: save message with username, when the endpoint is ready.
    const { account } = getCookies()
    const cred: AccountCredentials = {
      email: account.username,
      password: account.password,
    }
    const createUserResponse = await USER_API_CALLS.createUser(values.email, UserRoles.VIP, cred)

    if (createUserResponse.status === 201) {
      //TODO: Remove this when the token is sent by email to the customers
      setCookie('userToken', createUserResponse.data.token)

      //TODO: Remove this alert when the token is sent by email to the customers
      alert(
        `The token to verify this account is: ${createUserResponse.data.token} copy and paste when you login with the new account created`
      )
      console.log(
        `The token to verify this account is: ${createUserResponse.data.token}. Copy and paste when you login with the new account created`
      )
      await backToPage(true)
    } else {
      setError({
        status: `Error!`,
        statusText: `${createUserResponse.statusText}`,
      })
    }
  }

  const handleCancel = async () => await backToPage(false)

  return (
    <Box marginY={4} sx={{ position: 'relative', left: '15%' }}>
      <Typography variant="h4" fontWeight={600}>
        Invite New Special Guest
      </Typography>
      <Typography className={classes.title} marginY={2}>
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
              <Form method="post" autoComplete="false">
                <Box display="flex" flexDirection="column" className={classes.container}>
                  <FormLabel className={classes.label}>Special guest email</FormLabel>
                  <Field
                    component={TextField}
                    name="email"
                    placeholder="Email"
                    hiddenLabel
                    type="email"
                    className={classes.input}
                    fullWidth
                  />

                  <FormLabel className={classes.label}>Message in this Invite</FormLabel>
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
