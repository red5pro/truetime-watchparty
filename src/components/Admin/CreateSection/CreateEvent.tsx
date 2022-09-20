import * as React from 'react'
import * as Yup from 'yup'
import { Box, FormLabel, LinearProgress, ListItemText, MenuItem, Select, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { AccountCredentials } from '../../../models/AccountCredentials'
import useCookies from '../../../hooks/useCookies'
import useStyles from './CreateSection.module'
import { SERIES_API_CALLS } from '../../../services/api/serie-api-calls'
import { Serie } from '../../../models/Serie'
import moment from 'moment'

const getInitialValues = () => {
  const todayDate = moment()
  todayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  const initialValues = {
    displayName: '',
    startDatetime: todayDate,
    endDatetime: todayDate,
    serie: -1,
  }

  return initialValues
}

const getValidationSchema = () => {
  const todayDate = moment()
  todayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().max(50, 'Event Name must at most 50 characters').required('Event Name field is required'),
    startDatetime: Yup.date()
      .required('Start Date field is required')
      .min(todayDate, 'Date should be greater than today'),
    endDatetime: Yup.date()
      .required('End Date field is required')
      .when(
        'startDatetime',
        (startDatetime, schema) => startDatetime && schema.min(startDatetime, 'End Date must be later that Start Date')
      ),
    serie: Yup.number().required('Serie field is required'),
  })
  return validationSchema
}

interface ICreateEventProps {
  backToPage: (value: boolean) => Promise<void>
  series: Serie[]
}

const CreateEvent = (props: ICreateEventProps) => {
  const { backToPage, series } = props

  const [error, setError] = React.useState<any>()

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])

  const handleSubmit = async (values: any) => {
    const { account } = getCookies()
    const cred: AccountCredentials = {
      email: account.username,
      password: account.password,
    }

    // Saving event datetime in UTC
    const data = {
      displayName: values.displayName,
      startTime: values.startDatetime.utc().valueOf(),
      endTime: values.endDatetime.utc().valueOf(),
    }

    const response = await SERIES_API_CALLS.createEpisode(values.serie, data, cred)
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
        Event
      </Typography>
      <Typography className={classes.title} marginY={2}>
        Please configure this event
      </Typography>

      <>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={async (values) => handleSubmit(values)}
          enableReinitialize
        >
          {(props: any) => {
            const { submitForm, isSubmitting, setFieldValue, values, errors, touched } = props

            const setSerieId = (ev: any) => {
              setFieldValue('serie', ev?.target?.value)
            }

            return (
              <Form method="post">
                <Box display="flex" flexDirection="column" className={classes.container}>
                  <Box display="flex" flexDirection="column" minHeight={300}>
                    <FormLabel className={classes.label}>Event Name</FormLabel>
                    <Field
                      component={TextField}
                      name="displayName"
                      type="text"
                      hiddenLabel
                      className={classes.input}
                      fullWidth
                    />
                    <Box display="flex" width="100%">
                      <Box display="flex" flexDirection="column" width="100%">
                        <FormLabel className={classes.label}>Start Date</FormLabel>
                        <DateTimePicker
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
                        <FormLabel className={classes.label}>End Date</FormLabel>
                        <DateTimePicker
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
                    <FormLabel className={classes.label}>Choose a Serie</FormLabel>
                    <Select
                      id="serie"
                      name="serie"
                      placeholder="Select a Serie"
                      onChange={setSerieId}
                      className={`${classes.selectField} ${
                        errors.country && touched.country ? classes.errorTextField : ''
                      }`}
                      MenuProps={{
                        style: {
                          zIndex: 13000,
                        },
                      }}
                      value={values.serie}
                      fullWidth
                    >
                      {series.map((serie: Serie) => {
                        return (
                          <MenuItem value={serie.seriesId} key={serie.seriesId} className={classes.menuItem}>
                            <ListItemText className={classes.item}>{serie.displayName}</ListItemText>
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {errors.country && touched.country && (
                      <Typography className={classes.errorValidation}>{errors.country}</Typography>
                    )}
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

export default CreateEvent
