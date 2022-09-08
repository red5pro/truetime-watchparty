import * as React from 'react'
import * as Yup from 'yup'

import useCookies from '../../../hooks/useCookies'

import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { UserAccount } from '../../../models/UserAccount'
import SignUp from './SignUp'

const initialValues = {
  email: '',
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
    .min(8, 'Password must be at least 8 characters')
    .test('', 'Password must include at least one number, one uppercase letter and one lowercase letter', (value) =>
      testPassword(value)
    )
    .required('Password field is required'),
})

interface ISignInEmailProps {
  onActions?: IStepActionsSubComponent
}

const SignInEmail = (props: ISignInEmailProps) => {
  const { onActions } = props
  const { classes } = useStyles()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(['userAccount', 'account'])

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string>()
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false)
  const [accountUnverified, setAccountUnverified] = React.useState<boolean>(false)
  const [signUp, setSignUp] = React.useState<boolean>(false)

  const handleSubmit = async (values: any) => {
    const response = await USER_API_CALLS.signin(values.email, values.password)

    if (response.status === 200 && response.data) {
      const account: UserAccount = response.data
      if (account.isVerified) {
        setCookie('account', values, { secure: true, samesite: 'Strict' })
        setCookie('userAccount', response.data, { secure: true, samesite: 'Strict' })

        if (onActions) {
          onActions.onNextStep()
          return
        }
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

  if (signUp) {
    return <SignUp onActions={onActions} />
  }

  return (
    <Formik
      initialValues={initialValues}
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
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Sign In</Typography>
              <Typography>Please verify your account before creating a watch party</Typography>
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
              <Link textAlign="end" onClick={() => setForgotPassword(true)}>
                Forgot your password?
              </Link>

              <Link textAlign="end" onClick={() => setSignUp(true)}>
                <strong>Need to Create a new Account?</strong>
              </Link>

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
              {errorAfterSubmit && (
                <Typography sx={{ fontSize: '20px' }} className={classes.errorValidation}>
                  {errorAfterSubmit}
                </Typography>
              )}
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default SignInEmail
