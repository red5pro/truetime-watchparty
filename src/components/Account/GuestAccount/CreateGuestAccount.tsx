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
import { useNavigate } from 'react-router-dom'

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
  // startTime: Yup.date(),
  // endTime: Yup.date(),
  // message: Yup.string().max(150).required('Message field is required'),
})

interface ICreateGuestAccount {
  backToPage: (value: boolean) => Promise<void>
}

const CreateGuestAccount = (props: ICreateGuestAccount) => {
  const { backToPage } = props

  const [error, setError] = React.useState<any>()
  const [goBack, setGoBack] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string>()
  const [email, setEmail] = React.useState<string>('')

  const { classes } = useStyles()
  const navigate = useNavigate()
  const { getCookies } = useCookies(['account', 'userToken'])

  React.useEffect(() => {
    if (goBack) {
      backToPage(true)
    }
  }, [goBack])

  const handleSubmit = async (values: any) => {
    // TODO: save message with username, when the endpoint is ready.
    const { account } = getCookies()
    const cred: AccountCredentials = {
      email: account.username,
      password: account.password,
    }
    const createUserResponse = await USER_API_CALLS.createUser(values.email, UserRoles.VIP, cred)

    if (createUserResponse.status === 201) {
      setEmail(values.email)
      setToken(createUserResponse.data.token)
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

                  {/* <FormLabel className={classes.label}>Message in this Invite</FormLabel>
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
                  )} */}
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
            message={`${error.statusText}`}
            confirmLabel="Ok"
            onConfirm={() => setError(null)}
          />
        )}
        {token && email && (
          <SimpleAlertDialog
            title={`A verification link has been sent to your email account - ${email}`}
            message="Please click on the link that has just been sent to your email account to verify your email and \
            finish account creation."
            confirmLabel="Ok"
            onConfirm={() => setGoBack(true)}
            denyLabel={process.env.NODE_ENV === 'development' ? 'Go To Verify Account' : undefined}
            onDeny={
              process.env.NODE_ENV === 'development'
                ? () => navigate(`/verify?email=${encodeURI(email)}&token=${encodeURI(token)}`)
                : undefined
            }
          />
        )}
      </>
    </Box>
  )
}

export default CreateGuestAccount
