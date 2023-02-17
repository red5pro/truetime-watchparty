import * as React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { TextField } from 'formik-mui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Form.module'

const AddCohostForm = ({ handleSubmit, onClose }: { conferenceId: string; handleSubmit: any; onClose: any }) => {
  const { classes } = useStyles()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email field is required'),
  })

  return (
    <Box>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values)
          resetForm({ values: { email: '' } })
        }}
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
                    type="submit"
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
    </Box>
  )
}

export default AddCohostForm
