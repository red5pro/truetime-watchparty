/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
import { isWatchParty } from '../../../settings/variables'

const context = 'live'
const guidPrefix = new RegExp(`^${context}/`)
const pathHasGuid = (path: string) => guidPrefix.test(path)

const getInitialValues = () => {
  const todayDate = moment()
  todayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  const initialValues = {
    displayName: '',
    startDatetime: todayDate,
    endDatetime: todayDate,
    serie: '',
    streamGuid: `${context}/demo-stream`,
  }

  return initialValues
}

const getValidationSchema = () => {
  const todayDate = moment()
  todayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().max(50, 'Event Name must at most 50 characters').required('Event Name field is required'),
    startDatetime: Yup.date()
      .required('Start Date/Time field is required')
      .min(todayDate, 'Date/Time should be greater than today'),
    endDatetime: Yup.date()
      .required('End Date/Time field is required')
      .when(
        'startDatetime',
        (startDatetime, schema) =>
          startDatetime && schema.min(startDatetime, 'End Date/Time must be later that Start Date/Time')
      ),
    serie: Yup.number().required('Serie field is required'),
    streamGuid: isWatchParty ? Yup.string().max(20).required('Event Stream Guid field is required') : Yup.string(),
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
    const { streamGuid } = values

    // Saving event datetime in UTC
    const data = {
      displayName: values.displayName,
      startTime: values.startDatetime.utc().valueOf(),
      endTime: values.endDatetime.utc().valueOf(),
      streamGuid: pathHasGuid(streamGuid) ? streamGuid : `${context}/${streamGuid}`,
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
                    <FormLabel className={classes.label}>Stream GUID</FormLabel>
                    <Field
                      component={TextField}
                      name="streamGuid"
                      type="text"
                      hiddenLabel
                      className={classes.input}
                      fullWidth
                    />
                    <Box display="flex" width="100%">
                      <Box display="flex" flexDirection="column" width="100%">
                        <FormLabel className={classes.label}>Start Date/Time</FormLabel>
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
                        <FormLabel className={classes.label}>End Date/Time</FormLabel>
                        <DateTimePicker
                          renderInput={(props: any) => (
                            <Field
                              component={TextField}
                              name="endDatetime"
                              hiddenLabel
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
                        errors.serie && touched.serie ? classes.errorTextField : ''
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
                    {errors.serie && touched.serie && (
                      <Typography className={classes.errorValidation}>{errors.serie}</Typography>
                    )}

                    {isWatchParty && (
                      <>
                        <FormLabel className={classes.label}>Event Stream Guid</FormLabel>
                        <Field
                          component={TextField}
                          name="streamGuid"
                          type="text"
                          hiddenLabel
                          className={classes.input}
                          fullWidth
                        />
                      </>
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
