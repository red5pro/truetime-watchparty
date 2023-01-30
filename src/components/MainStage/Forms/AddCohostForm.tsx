import * as React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { TextField } from 'formik-mui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Form.module'

const SimpleAlertDialog = React.lazy(() => import('../../Modal/SimpleAlertDialog'))

const AddCohostForm = ({
  conferenceId,
  addCoHostList,
  onClose,
}: {
  conferenceId: string
  addCoHostList: any
  onClose: any
}) => {
  const [error, setError] = React.useState<any>(null)
  const [success, setSuccess] = React.useState<boolean>(false)

  const { classes } = useStyles()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email field is required'),
  })

  const handleSubmit = async (values: any) => {
    const response = await addCoHostList(conferenceId, values.email)

    if (response.status === 200) {
      setSuccess(true)
    } else {
      setError({
        status: 'Warning',
        statusText: response.statusText ?? 'There was an error while resetting your password, please try again.',
      })
    }
  }

  return (
    <Box>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => {
          const { submitForm, isSubmitting } = props

          return (
            <Form method="post">
              <Box display="flex" flexDirection="column" marginY={1} className={classes.container}>
                <Typography>{'Please enter the email address associated with an existing account.'}</Typography>

                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label="CoHost Email"
                  placeholder="CoHost Email"
                  className={classes.input}
                  fullWidth
                />
                <Box display="flex" className={classes.buttonsContainer}>
                  <CustomButton
                    disabled={isSubmitting}
                    onClick={submitForm}
                    size={BUTTONSIZE.MEDIUM}
                    buttonType={BUTTONTYPE.SECONDARY}
                    className={classes.signInButton}
                  >
                    Add Cohost
                  </CustomButton>
                  <CustomButton
                    disabled={isSubmitting}
                    onClick={onClose}
                    size={BUTTONSIZE.MEDIUM}
                    buttonType={BUTTONTYPE.PRIMARY}
                    className={classes.signInButton}
                  >
                    Close
                  </CustomButton>
                </Box>
                {isSubmitting && <LinearProgress />}
              </Box>
            </Form>
          )
        }}
      </Formik>
      {success && (
        <SimpleAlertDialog
          title={`The Cohost has been added`}
          message="Please share the conference url to the cohost."
          confirmLabel="Ok"
          onConfirm={() => location.reload()}
        />
      )}
      {error && (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Ok"
          onConfirm={() => setError(null)}
        />
      )}
    </Box>
  )
}

export default AddCohostForm
