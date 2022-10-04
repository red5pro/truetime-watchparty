import * as React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { TextField } from 'formik-mui'
import { Field, Form, Formik } from 'formik'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { signUpValidationSchema } from '../../../utils/accountUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import useStyles from './Signin.module'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [error, setError] = React.useState<any>(null)
  const [email, setEmail] = React.useState<string>('')
  const [token, setToken] = React.useState<string>('')

  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.resetPassword(values.email)

    if (response.status === 202) {
      setToken(response.data.token)
      setEmail(values.email)
    } else {
      setError({
        status: 'Warning',
        statusText: response.statusText,
      })
    }
  }

  return (
    <Box>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={signUpValidationSchema}
        onSubmit={async (values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => {
          const { submitForm, isSubmitting } = props

          return (
            <Form method="post">
              <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
                <Typography className={classes.title}>Forgot my password</Typography>

                <Typography>
                  {
                    "Please enter the email address associated with your account. We'll send an email with a link to reset your password."
                  }
                </Typography>

                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Email"
                  className={classes.input}
                  fullWidth
                />

                <CustomButton
                  disabled={isSubmitting}
                  onClick={submitForm}
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.SECONDARY}
                  fullWidth
                  className={classes.signInButton}
                >
                  Reset Password
                </CustomButton>
                {isSubmitting && <LinearProgress />}
              </Box>
            </Form>
          )
        }}
      </Formik>
      {token && email && (
        <SimpleAlertDialog
          title={`A link to reset password has been sent to your email account - ${email}`}
          message="Please click on the link that has just been sent to your email account to reset the password."
          confirmLabel="Ok"
          onConfirm={() => location.reload()}
          denyLabel={process.env.NODE_ENV === 'development' ? 'Reset Password' : undefined}
          onDeny={
            process.env.NODE_ENV === 'development'
              ? () => navigate(`/verify?email=${encodeURI(email)}&token=${encodeURI(token)}`)
              : undefined
          }
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
    </Box>
  )
}

export default ResetPassword
