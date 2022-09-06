import * as React from 'react'
import * as Yup from 'yup'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import useStyles from './SignInModal.module'
import { useCookies } from 'react-cookie'

import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const SignInModal = (props: SignInModalProps) => {
  const { open, onDismiss } = props

  const { classes } = useStyles()
  const [cookies, setCookie] = useCookies(['account', 'userAccount'])

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
                  email: cookies && cookies.account ? cookies.account.email : '',
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
