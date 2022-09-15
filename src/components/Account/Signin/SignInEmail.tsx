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

const initialValues = {
  email: '',
  password: '',
}

const adminInitialValues = {
  username: '',
  password: '',
}

const testPassword = (value?: string) => {
  if (value) {
    return /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9]).{8,}$/.test(value)
  } else return false
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email field is required'),
  password: Yup.string()
    // .min(8, 'Password must be at least 8 characters')
    // .test('', 'Password must include at least one number, one uppercase letter and one lowercase letter', (value) =>
    //   testPassword(value)
    // )
    .required('Password field is required'),
})

const adminValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username field is required'),
  password: Yup.string().required('Password field is required'),
})

interface ISignInEmailProps {
  onActions?: IStepActionsSubComponent
  redirectAfterLogin?: () => void
  validateAccount?: (account: any) => boolean
  isAdminLoggingIn?: boolean
}

const SignInEmail = (props: ISignInEmailProps) => {
  const { onActions, validateAccount, redirectAfterLogin, isAdminLoggingIn = false } = props
  const { classes } = useStyles()
  const { getCookies, setCookie } = useCookies(['userAccount', 'account'])

  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false)
  const [accountUnverified, setAccountUnverified] = React.useState<boolean>(false)
  const [signUp, setSignUp] = React.useState<boolean>(false)
  const [verifyAccount, setVerifyAccount] = React.useState<boolean>(false)
  const [error, setError] = React.useState<any | null>(null)

  React.useEffect(() => {
    if (verifyAccount) {
      if (onActions && getCookies()?.account) {
        onActions.onNextStep()
        return
      } else if (redirectAfterLogin) {
        redirectAfterLogin()
      }
    }
  }, [verifyAccount])

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.signin(isAdminLoggingIn ? values.username : values.email, values.password)

    if (response.status === 200 && response.data) {
      let isValid = true

      if (validateAccount) {
        isValid = validateAccount(response.data)
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

        setVerifyAccount(true)
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

  // TODO
  if (forgotPassword) {
    return <Box>Forgot Password</Box>
  }

  // TODO
  if (accountUnverified) {
    return <Box>Verify Account</Box>
  }

  if (signUp) {
    return <SignUp onActions={onActions} />
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
          const { submitForm, isSubmitting } = props

          const handleKeyPress = (ev: any) => {
            if (ev && ev.code === 'Enter') {
              submitForm()
            }
          }

          return (
            <Form method="post">
              <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
                <Typography className={classes.title}>Sign In</Typography>
                <Typography>Please verify your account before creating a watch party</Typography>
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
                  <>
                    {/* TODO IMPLEMENT FORGOT PASSWORD */}
                    <Link textAlign="end" onClick={() => setForgotPassword(true)}>
                      Forgot your password?
                    </Link>

                    <Link textAlign="end" onClick={() => setSignUp(true)}>
                      <strong>Need to Create a new Account?</strong>
                    </Link>
                  </>
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
    </>
  )
}

export default SignInEmail
