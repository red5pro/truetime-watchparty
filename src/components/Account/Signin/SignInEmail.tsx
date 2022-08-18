import * as React from 'react'
import * as Yup from 'yup'
import { useCookies } from 'react-cookie'
import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'

import SignUp from './SignUp'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'

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
  const [cookies, setCookie] = useCookies(['account'])

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<boolean>(false)
  const [createNewAccount, setCreateAccount] = React.useState<boolean>(false)
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false)

  const handleSubmit = async (values: any) => {
    // const response = await API_REQUEST

    setCookie('account', values)

    // if (response.data) {
    if (onActions) {
      onActions.onNextStep()
      return
      // }
    }

    // setErrorAfterSubmit(response.statusText)
  }

  if (createNewAccount) {
    return <SignUp />
  }

  if (forgotPassword) {
    return <Box>Forgot Password</Box>
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

        return (
          <Form autoComplete="off" method="post">
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Sign In</Typography>
              <Typography>Please verify your account before creating a watchparty</Typography>
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                className={classes.input}
              />
              <Field component={TextField} name="password" type="password" label="Password" className={classes.input} />

              {/* TODO IMPLEMENT FORGOT PASSWORD */}
              <Link textAlign="end" onClick={() => setForgotPassword(true)}>
                Forgot your password?
              </Link>
              <Link textAlign="end" onClick={() => setCreateAccount(true)}>
                <strong>Need to create a new account?</strong>
              </Link>

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
                <Typography sx={{ fontSize: '30px' }} className={classes.errorValidation}>
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
