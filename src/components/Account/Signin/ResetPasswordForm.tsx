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
  const [success, setSuccess] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')
  const [token, setToken] = React.useState<string>('')

  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.resetPassword(values.email)

    if (response.status === 202) {
      setSuccess(true)
      setToken(response.data.token)
      setEmail(values.email)
    } else {
      setError({
        status: 'Warning',
        statusText: response.statusText ?? 'There was an error while resetting your password, please try again.',
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
      {success && (
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
