import * as React from 'react'
import * as Yup from 'yup'
import { useCookies } from 'react-cookie'
import { Box, LinearProgress, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'

import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import VerifyEmail from './VerifyEmail'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'

const initialValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
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
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password Confirmation field is required'),
})

interface ISignUpProps {
  onActions?: IStepActionsSubComponent
}

const SignUp = (props: ISignUpProps) => {
  const { onActions } = props
  const { classes } = useStyles()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(['account'])

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()
  const [shouldVerifyEmail, setShouldVerifyEmail] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')

  const handleSubmit = async (values: any) => {
    setErrorAfterSubmit(undefined)
    const response = await USER_API_CALLS.createUser(values.email, values.password)

    if (response?.status === 201 && response?.data.token) {
      setCookie('account', { email: values.email, password: values.password }, { secure: true })
      setEmail(values.email)

      //TODO CHECK THIS STEP
      // setShouldVerifyEmail(true)
      const verifyResponse = await USER_API_CALLS.verifyAccount(values.email, values.password, response.data.token)

      if (verifyResponse?.status === 200) {
        onActions?.onNextStep()
      } else {
        setErrorAfterSubmit(
          verifyResponse?.statusText ?? 'There was an error verifying your account, please sign in and try again'
        )
      }
    } else {
      setErrorAfterSubmit(response?.statusText ?? 'There was an error creating your account, please try again')
    }
  }

  if (shouldVerifyEmail) {
    return <VerifyEmail email={email} onActions={onActions} />
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
          <Form method="post" onChange={() => setErrorAfterSubmit(undefined)}>
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Sign Up</Typography>
              <Typography>
                Please enter a valid email address and a password. We’ll send you a 6-digit code to verify your email.
              </Typography>
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                className={`${classes.input} ${errorAfterSubmit?.includes(email) ? classes.errorTextField : ''}`}
              />
              <Field component={TextField} name="password" type="password" label="Password" className={classes.input} />
              <Field
                component={TextField}
                name="passwordConfirmation"
                type="password"
                label="Password Confirmation"
                className={classes.input}
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

export default SignUp
