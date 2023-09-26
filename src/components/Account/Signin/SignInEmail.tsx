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

import useCookies from '../../../hooks/useCookies'

import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import { IStepActionsSubComponent, UserRoles } from '../../../utils/commonUtils'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { UserAccount } from '../../../models/UserAccount'
import SignUp from './SignUp'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import PasswordField from '../../Form/PasswordField'
import { validationSchema } from '../../../utils/accountUtils'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { isWatchParty } from '../../../settings/variables'
import ResetPassword from './ResetPasswordForm'

const initialValues = {
  email: '',
  password: '',
}

const adminInitialValues = {
  username: '',
  password: '',
}

const adminValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username field is required'),
  password: Yup.string().required('Password field is required'),
})

interface ISignInEmailProps {
  onActions?: IStepActionsSubComponent
  redirectAfterLogin?: () => void
  validateAccount?: ((account: any) => boolean) | ((userAccount: UserAccount, account: AccountCredentials) => boolean)
  isAdminLoggingIn?: boolean
  isVipLoggingIn?: boolean
}

const SignInEmail = (props: ISignInEmailProps) => {
  const { onActions, validateAccount, redirectAfterLogin, isAdminLoggingIn = false, isVipLoggingIn = false } = props
  const { classes } = useStyles()
  const { getCookies, setCookie } = useCookies(['userAccount', 'account'])

  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false)
  const [accountUnverified, setAccountUnverified] = React.useState<boolean>(false)
  const [signUp, setSignUp] = React.useState<boolean>(false)
  const [accountIsVerified, setAccountIsVerified] = React.useState<boolean>(false)
  const [error, setError] = React.useState<any | null>(null)
  const [email, setEmail] = React.useState<string>()

  React.useEffect(() => {
    if (accountIsVerified) {
      if (onActions && getCookies()?.account) {
        onActions.onNextStep()
        return
      } else if (redirectAfterLogin) {
        redirectAfterLogin()
      }
    }
  }, [accountIsVerified])

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.signin(isAdminLoggingIn ? values.username : values.email, values.password)

    if (response.status === 200 && response.data) {
      let isValid = true

      if (validateAccount) {
        isValid = validateAccount(response.data, values)
      }

      if (isAdminLoggingIn && response.data.role !== UserRoles.ADMIN) {
        isValid = false
      }

      if (!isValid) {
        setError({
          status: 'Incorrect Login Account',
          statusText: 'Please retry with the corresponding login account.',
        })
        return
      }

      const account: UserAccount = response.data
      if (account.isVerified) {
        setCookie('account', values, { secure: true, samesite: 'Strict' })
        setCookie('userAccount', response.data, { secure: true, samesite: 'Strict' })

        setAccountIsVerified(true)
      } else {
        setAccountUnverified(true)
      }
    } else {
      setError({
        status: 'Warning',
        statusText: response.statusText,
      })
    }
  }

  if (forgotPassword) {
    return <ResetPassword />
  }

  if (signUp) {
    return <SignUp />
  }

  return (
    <>
      <Formik
        initialValues={isAdminLoggingIn ? adminInitialValues : initialValues}
        validationSchema={isAdminLoggingIn ? adminValidationSchema : validationSchema}
        onSubmit={async (values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => {
          const { submitForm, isSubmitting, setFieldValue } = props

          const handleKeyPress = (ev: any) => {
            if (ev && ev.code === 'Enter') {
              submitForm()
            }
          }

          const onEmailChange = (ev: any) => {
            const value = ev?.target?.value

            setFieldValue('email', value)
            setEmail(value)
          }

          return (
            <Form method="post">
              <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
                <Typography className={classes.title}>Sign In</Typography>
                {!(isAdminLoggingIn || isVipLoggingIn) && (
                  <Typography>{`Please verify your account before creating a ${
                    isWatchParty ? 'Watch Party' : 'Webinar'
                  }`}</Typography>
                )}
                {isAdminLoggingIn ? (
                  <Field
                    component={TextField}
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Username"
                    className={classes.input}
                  />
                ) : (
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    className={classes.input}
                    fullWidth
                    onChange={onEmailChange}
                  />
                )}
                <Field
                  component={PasswordField}
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  className={classes.input}
                  onKeyPress={handleKeyPress}
                  autoComplete="off"
                  fullWidth
                  {...props}
                />

                {!isAdminLoggingIn && (
                  <Link textAlign="end" onClick={() => setForgotPassword(true)}>
                    Forgot your password?
                  </Link>
                )}
                {!(isAdminLoggingIn || isVipLoggingIn) && (
                  <Link textAlign="end" onClick={() => setSignUp(true)}>
                    <strong>Need to Create a new Account?</strong>
                  </Link>
                )}

                <CustomButton
                  disabled={isSubmitting}
                  onClick={submitForm}
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.SECONDARY}
                  fullWidth
                  className={classes.signInButton}
                >
                  Sign In
                </CustomButton>
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
      {accountUnverified && (
        <SimpleAlertDialog
          title="Information!"
          message={`An email has been sent to ${email}. In order to complete the account setup,
          please open that email and click the link inside.`}
          confirmLabel="Ok"
          onConfirm={() => setAccountUnverified(false)}
        />
      )}
    </>
  )
}

export default SignInEmail
