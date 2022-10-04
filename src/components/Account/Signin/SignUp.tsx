import * as React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'

import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { UserRoles } from '../../../utils/commonUtils'
import { signUpValidationSchema } from '../../../utils/accountUtils'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  email: '',
}

const SignUp = () => {
  const { classes } = useStyles()

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()
  const [shouldVerifyEmail, setShouldVerifyEmail] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')

  //TODO REMOVE THIS WHEN EMAIL VERIFICATION ACCOUNT IS DONE
  const [token, setToken] = React.useState<string>()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    setErrorAfterSubmit(undefined)

    const response = await USER_API_CALLS.createUser(values.email, UserRoles.ORGANIZER)

    if (response?.status === 201 && response?.data.token) {
      setEmail(values.email)

      //TODO: Remove this when the token is sent by email to the customers
      setToken(response.data.token)
      setShouldVerifyEmail(true)
    } else {
      setErrorAfterSubmit(response?.statusText ?? 'There was an error creating your account, please try again')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signUpValidationSchema}
      onSubmit={async (values) => handleSubmit(values)}
      enableReinitialize
    >
      {(props: any) => {
        const { submitForm, isSubmitting } = props

        return (
          <Form method="post" onChange={() => setErrorAfterSubmit(undefined)}>
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Sign Up</Typography>
              <Typography>Please enter a valid email address. We’ll send you a code to verify your email.</Typography>
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                className={`${classes.input} ${errorAfterSubmit?.includes(email) ? classes.errorTextField : ''}`}
              />

              <CustomButton
                disabled={isSubmitting}
                onClick={submitForm}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
                fullWidth
              >
                Sign Up
              </CustomButton>
              {isSubmitting && <LinearProgress />}
              {errorAfterSubmit && (
                <SimpleAlertDialog
                  title="Warning"
                  message={errorAfterSubmit}
                  onConfirm={() => setErrorAfterSubmit(errorAfterSubmit)}
                  confirmLabel="Ok"
                />
              )}
              {shouldVerifyEmail && token && email && (
                <SimpleAlertDialog
                  title={`A verification link has been sent to your email account - ${email}`}
                  message="Please click on the link that has just been sent to your email account to verify your email and finish account creation."
                  confirmLabel="Ok"
                  onConfirm={() => setShouldVerifyEmail(false)}
                  denyLabel={process.env.NODE_ENV === 'development' ? 'Go To Verify Account' : undefined}
                  onDeny={
                    process.env.NODE_ENV === 'development'
                      ? () => navigate(`/verify?email=${encodeURI(email)}&token=${encodeURI(token)}`)
                      : undefined
                  }
                />
              )}
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default SignUp
