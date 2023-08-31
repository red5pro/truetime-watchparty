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
  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()
  const [shouldVerifyEmail, setShouldVerifyEmail] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')
  const [token, setToken] = React.useState<string>()

  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    setErrorAfterSubmit(undefined)

    const response = await USER_API_CALLS.createUser(values.email, UserRoles.ORGANIZER)

    if (response?.status === 201 && response?.data.token) {
      setEmail(values.email)
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
