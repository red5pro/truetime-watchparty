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
import { UserRoles } from '../../../utils/commonUtils'
import { accountVerificationSchema } from '../../../utils/accountUtils'
import useCookies from '../../../hooks/useCookies'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../../Form/PasswordField'
import { isWatchParty } from '../../../settings/variables'

interface IVerifyEmailAccountProps {
  email: string
  token: string
}

const VerifyEmailAccount = (props: IVerifyEmailAccountProps) => {
  const { email, token } = props
  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<any | undefined>()

  const navigate = useNavigate()
  const { classes } = useStyles()

  const { setCookie } = useCookies(['userAccount', 'account'])

  const initialValues = {
    email: decodeURIComponent(email) ?? '',
    token: token ?? '',
    password: '',
    passwordConfirmation: '',
  }

  const handleSubmit = async (values: any) => {
    setErrorAfterSubmit(undefined)
    const verifyResponse = await USER_API_CALLS.verifyAccount(values.email, values.password, values.token)

    if (verifyResponse?.status === 200) {
      const response = await USER_API_CALLS.signin(values.email, values.password)

      if (response.status === 200 && response.data) {
        setCookie('account', { email: values.email, password: values.password }, { secure: true, samesite: 'Strict' })
        setCookie('userAccount', response.data, { secure: true, samesite: 'Strict' })

        const redirect =
          response.data.role === UserRoles.ORGANIZER
            ? '/'
            : response.data.role === UserRoles.VIP
            ? '/join/guest'
            : '/landing'

        setErrorAfterSubmit({
          title: 'The account was successfully verified!',
          statusText: `You can continue to ${isWatchParty ? 'Watch a Party' : 'a Webinar'}.`,
          onConfirm: () => navigate(redirect),
        })
      }
    } else {
      setErrorAfterSubmit({
        title: 'Warning!',
        statusText: 'There was an error verifying your account.',
        onConfirm: () => setErrorAfterSubmit(errorAfterSubmit),
      })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={accountVerificationSchema}
      onSubmit={async (values) => {
        await handleSubmit(values)
      }}
      enableReinitialize
    >
      {(props: any) => {
        const { submitForm, isSubmitting, values } = props

        const handleKeyPress = (ev: any) => {
          if (ev && ev.code === 'Enter') {
            submitForm()
          }
        }

        return (
          <Form method="post" autoComplete="false">
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Verify your account</Typography>
              <Field component={TextField} name="email" type="text" label="Email" className={classes.input} />
              <Field
                component={TextField}
                name="token"
                type="text"
                label="Code"
                value={values.token}
                className={classes.input}
                style={{ display: initialValues.token ? 'none' : 'block' }}
              />

              {/* TODO IMPLEMENT RE- SEND EMAIL WITH CODE */}
              {/* <Link textAlign="end" onClick={() => console.log('Send email')}>
                Didn’t get a code? Resend code
              </Link> */}

              <Field
                component={PasswordField}
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete={false}
                className={classes.input}
                {...props}
              />
              <Field
                component={PasswordField}
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete={false}
                label="Password Confirmation"
                className={classes.input}
                onKeyPress={handleKeyPress}
                {...props}
              />

              <CustomButton
                disabled={isSubmitting}
                onClick={submitForm}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
                fullWidth
              >
                Verify
              </CustomButton>
              {isSubmitting && <LinearProgress />}
              {errorAfterSubmit && (
                <SimpleAlertDialog
                  title={errorAfterSubmit.title}
                  message={errorAfterSubmit.statusText}
                  onConfirm={errorAfterSubmit.onConfirm}
                  confirmLabel="Ok"
                />
              )}
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default VerifyEmailAccount
