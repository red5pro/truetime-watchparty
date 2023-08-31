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
import * as Yup from 'yup'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'

import useCookies from '../../hooks/useCookies'
import useStyles from './SignInModal.module'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import { UserAccount } from '../../models/UserAccount'
import { USER_API_CALLS } from '../../services/api/user-api-calls'

// TODO: Move these to common utils.
const testPassword = (value?: string) => {
  if (value) {
    return /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9]).{8,}$/.test(value)
  } else return false
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email field is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .test('', 'Password must include at least one number, one uppercase letter and one lowercase letter', (value) =>
      testPassword(value)
    )
    .required('Password field is required'),
})

interface SignInModalProps {
  open: boolean
  onDismiss(account?: any): any
}

const SignInModal = (props: SignInModalProps) => {
  const { open, onDismiss } = props

  const { classes } = useStyles()
  const { getCookies, setCookie } = useCookies(['account', 'userAccount'])

  const [signInEmail, setSignInEmail] = React.useState<boolean>(false)
  const [signInFacebook, setSignInFacebook] = React.useState<boolean>(false)
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false)
  const [accountUnverified, setAccountUnverified] = React.useState<boolean>(false)
  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string>()

  const reset = () => {
    const t = setTimeout(() => {
      clearTimeout(t)
      setSignInEmail(false)
      setSignInFacebook(false)
    }, 1000)
  }

  const onClose = () => {
    onDismiss()
    reset()
  }

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.signin(values.email, values.password)
    if (response.status === 200 && response.data) {
      const account: UserAccount = response.data
      if (account.isVerified) {
        setCookie('account', values, { secure: true })
        setCookie('userAccount', response.data, { secure: true })
        onDismiss(values)
        reset()
      } else {
        setAccountUnverified(true)
      }
    } else {
      setErrorAfterSubmit(response.statusText)
    }
  }

  // TODO
  if (forgotPassword) {
    return <Box>Forgot Password</Box>
  }

  // TODO
  if (accountUnverified) {
    return <Box>Verify Account</Box>
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      onClose={onClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
          <Box display="flex" flexDirection="column" className={classes.container}>
            {!signInEmail && !signInFacebook && (
              <>
                <Typography className={classes.title}>Sign In</Typography>
                <Typography marginY={1}>Sign In to your Watch Party!</Typography>
                <CustomButton
                  fullWidth
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.SECONDARY}
                  onClick={() => setSignInEmail(true)}
                >
                  Sign In with Email
                </CustomButton>
                <Typography textAlign="center">Or</Typography>

                <CustomButton
                  fullWidth
                  startIcon={<FacebookIcon />}
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.FACEBOOK}
                  onClick={() => setSignInFacebook(true)}
                >
                  Sign In with Facebook
                </CustomButton>
              </>
            )}
            {signInEmail && (
              <Formik
                initialValues={{
                  email: getCookies()?.account?.email ?? '',
                  password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => handleSubmit(values)}
                enableReinitialize
              >
                {(props: any) => {
                  const { submitForm, isSubmitting } = props

                  const handleKeyPress = (ev: any) => {
                    if (ev && ev.code === 'Enter') {
                      submitForm()
                    }
                  }

                  return (
                    <Form method="post">
                      <Stack direction="column" marginY={4}>
                        <Typography className={classes.title}>Sign In</Typography>
                        <Typography>Please verify your account before entering your watch party</Typography>
                        <Field
                          component={TextField}
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="Email"
                          className={classes.input}
                        />
                        <Field
                          component={TextField}
                          name="password"
                          type="password"
                          label="Password"
                          className={classes.input}
                          onKeyPress={handleKeyPress}
                        />

                        {/* TODO IMPLEMENT FORGOT PASSWORD */}
                        {/* <Link textAlign="end" onClick={() => setForgotPassword(true)}>
                          Forgot your password?
                        </Link> */}

                        <CustomButton
                          disabled={isSubmitting}
                          onClick={submitForm}
                          size={BUTTONSIZE.MEDIUM}
                          buttonType={BUTTONTYPE.SECONDARY}
                          fullWidth
                        >
                          Sign In
                        </CustomButton>
                        {isSubmitting && <LinearProgress />}
                        {errorAfterSubmit && (
                          <Typography sx={{ fontSize: '20px' }} className={classes.errorValidation}>
                            {errorAfterSubmit}
                          </Typography>
                        )}
                      </Stack>
                    </Form>
                  )
                }}
              </Formik>
            )}
            {signInFacebook && <Box>Facebook</Box>}
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default SignInModal
