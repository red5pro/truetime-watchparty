import * as React from 'react'
import * as Yup from 'yup'
import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
const initialValues = {
  code: '',
}

const validationSchema = Yup.object().shape({
  code: Yup.string().max(6).min(6).required('Code field is required'),
})

interface IVerifyEmailProps {
  email: string
  onActions?: IStepActionsSubComponent
}

const VerifyEmail = (props: IVerifyEmailProps) => {
  const { email, onActions } = props
  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()

  const { classes } = useStyles()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log({ values })
        if (onActions) {
          onActions.onNextStep()
        }
      }}
      enableReinitialize
    >
      {(props: any) => {
        const { submitForm, isSubmitting } = props

        return (
          <Form method="post">
            <Box display="flex" flexDirection="column" marginY={4} className={classes.container}>
              <Typography className={classes.title}>Verify your email</Typography>
              <Typography>{`Enter the 6-digit code that was sent to ${email} to verify your account.`}</Typography>
              <Field component={TextField} name="code" type="text" label="Code" className={classes.input} />

              {/* TODO IMPLEMENT RE- SEND EMAIL WITH CODE */}
              <Link textAlign="end" onClick={() => console.log('Send email')}>
                Didn’t get a code? Resend code
              </Link>

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

export default VerifyEmail
