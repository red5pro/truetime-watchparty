import * as React from 'react'
import * as Yup from 'yup'
import { Box, FormLabel, LinearProgress, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { AccountCredentials } from '../../../models/AccountCredentials'
import useCookies from '../../../hooks/useCookies'
import useStyles from './CreateSection.module'
import { SERIES_API_CALLS } from '../../../services/api/serie-api-calls'

const initialValues = {
  displayName: '',
  maxParticipants: 8,
  // startDatetime: new Date(),
  // endDatetime: new Date(),
}

const getValidationSchema = () => {
  const todayDate = new Date()
  todayDate.setHours(0)
  todayDate.setMinutes(0)
  todayDate.setSeconds(0)

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().max(50, 'Serie Name must at most 50 characters').required('Serie Name field is required'),
    maxParticipants: Yup.number()
      .min(1, 'Max. Participants must be greater than or equal to 1')
      .required('Max. Participants field is required'),
    // startDatetime: Yup.date()
    //   .required('Start Date/Time field is required')
    //   .min(todayDate, 'Date/Time should be greater than today'),
    // endDatetime: Yup.date()
    //   .required('End Date/Time field is required')
    //   .when(
    //     'startDatetime',
    //     (startDatetime, schema) => startDatetime && schema.min(startDatetime, 'End Date/Time must be later that Start Date/Time')
    //   ),
  })
  return validationSchema
}

interface ICreateSerieProps {
  backToPage: (value: boolean) => Promise<void>
}

const CreateSerie = (props: ICreateSerieProps) => {
  const { backToPage } = props

  const [error, setError] = React.useState<any>()

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])

  const handleSubmit = async (values: any) => {
    const { account } = getCookies()
    const cred: AccountCredentials = {
      email: account.username,
      password: account.password,
    }
    const data = {
      displayName: values.displayName,
      maxParticipants: values.maxParticipants,
    }

    const response = await SERIES_API_CALLS.createSerie(data, cred)
    if (response.status === 200) {
      await backToPage(true)
    } else {
      setError({
        status: `Error!`,
        statusText: `${response.statusText}`,
      })
    }
  }

  const handleCancel = async () => await backToPage(false)

  return (
    <Box marginY={4} sx={{ position: 'relative', left: '15%' }}>
      <Typography variant="h4" fontWeight={600}>
        Series
      </Typography>
      <Typography className={classes.title} marginY={2}>
        Please configure this series
      </Typography>

      <>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={async (values) => handleSubmit(values)}
          enableReinitialize
        >
          {(props: any) => {
            const { submitForm, isSubmitting } = props

            return (
              <Form method="post">
                <Box display="flex" flexDirection="column" className={classes.container}>
                  <Box display="flex" flexDirection="column" minHeight={300}>
                    <FormLabel className={classes.label}>Name of the series</FormLabel>
                    <Field
                      component={TextField}
                      name="displayName"
                      type="text"
                      hiddenLabel
                      className={classes.input}
                      fullWidth
                    />

                    <FormLabel className={classes.label}>Max. Participants</FormLabel>
                    <Field
                      component={TextField}
                      name="maxParticipants"
                      type="number"
                      hiddenLabel
                      className={classes.input}
                      fullWidth
                    />
                    {/* TODO: check if Start and End dates are needed. THE ENDPOINT DOES NOT ALLOW THEM YET */}
                    {/* <Box display="flex" width="100%">
                      <Box display="flex" flexDirection="column" width="100%">
                        <FormLabel className={classes.label}>Start Date/Time</FormLabel>
                        <DatePicker
                          renderInput={(props: any) => (
                            <Field
                              component={TextField}
                              name="startDatetime"
                              type="text"
                              hiddenLabel
                              fullWidth
                              {...props}
                            />
                          )}
                          className={`${classes.dateField}`}
                          value={values.startDatetime}
                          onChange={(newValue: any) => {
                            setFieldValue('startDatetime', newValue)
                          }}
                        />
                      </Box>
                      <Box display="flex" flexDirection="column" marginLeft="10px" width="100%">
                        <FormLabel className={classes.label}>End Date/Time</FormLabel>
                        <DatePicker
                          renderInput={(props: any) => (
                            <Field
                              component={TextField}
                              name="endDatetime"
                              hiddenLabel
                              placeholder="Date"
                              type="text"
                              fullWidth
                              {...props}
                            />
                          )}
                          className={`${classes.dateField}`}
                          value={values.endDatetime}
                          onChange={(newValue: any) => {
                            setFieldValue('endDatetime', newValue)
                          }}
                        />
                      </Box>
                    </Box>
                 */}
                  </Box>
                  <Box display="flex" justifyContent="space-around">
                    <CustomButton
                      disabled={isSubmitting}
                      onClick={submitForm}
                      size={BUTTONSIZE.MEDIUM}
                      buttonType={BUTTONTYPE.SECONDARY}
                      className={classes.signInButton}
                    >
                      Save
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
            message={`${error.status} - ${error.statusText}`}
            confirmLabel="Ok"
            onConfirm={() => setError(null)}
          />
        )}
      </>
    </Box>
  )
}

export default CreateSerie
