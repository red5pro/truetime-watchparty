import * as React from 'react'
import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import { accountVerificationSchema } from '../../../utils/accountUtils'
import useCookies from '../../../hooks/useCookies'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../../Form/PasswordField'

interface IVerifyEmailProps {
  email?: string
  onActions?: IStepActionsSubComponent
  validateAccount?: (account: any) => boolean
}

const VerifyEmail = (props: IVerifyEmailProps) => {
  const { email, onActions, validateAccount } = props
  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<any | undefined>()

  const navigate = useNavigate()
  const { classes } = useStyles()

  //TODO: Remove this: 'userToken' when the token is sent by email to the customers
  const { getCookies, setCookie, removeCookie } = useCookies(['userToken', 'account'])

  const initialValues = {
    email: email ?? '',
    token: getCookies().userToken ?? '',
    password: '',
    passwordConfirmation: '',
  }

  const handleSubmit = async (values: any) => {
    setErrorAfterSubmit(undefined)
    const verifyResponse = await USER_API_CALLS.verifyAccount(values.email, values.password, values.token)

    if (verifyResponse?.status === 200) {
      const response = await USER_API_CALLS.signin(values.email, values.password)

      if (response.status === 200 && response.data) {
        let isValid = true

        if (validateAccount) {
          isValid = validateAccount(response.data)
        }

        if (!isValid) {
          setErrorAfterSubmit({
            title: 'Incorrect Login Account',
            statusText: 'Please retry with the corresponding login account.',
            onConfirm: () => navigate('/'),
          })
          return
        }

        setCookie('account', values, { secure: true, samesite: 'Strict' })
        setCookie('userAccount', response.data, { secure: true, samesite: 'Strict' })

        //TODO: Remove this when the token is sent by email to the customers
        removeCookie('userToken')

        setErrorAfterSubmit({
          title: 'The account was successfully verified!',
          statusText: 'You can continue to the next step.',
          onConfirm: () => onActions?.onNextStep(),
        })
      }
    } else {
      setErrorAfterSubmit({
        title: 'Warning!',
        statusText: 'There was an error verifying your account, please sign in and try again.',
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
          <Form method="post">
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Verify your account</Typography>

              {/* TODO: Display this when send email code is implemented */}
              {/*{email && <Typography>{`Enter the 6-digit code that was sent to ${email} to verify your account.`}</Typography>} */}
              <Field component={TextField} name="email" type="text" label="Email" className={classes.input} />
              <Field
                component={TextField}
                name="token"
                type="text"
                label="Code"
                value={values.token}
                className={classes.input}
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
                className={classes.input}
                {...props}
              />
              <Field
                component={PasswordField}
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
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

export default VerifyEmail
