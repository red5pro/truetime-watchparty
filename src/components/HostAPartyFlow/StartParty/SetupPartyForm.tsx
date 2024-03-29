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
import { useNavigate } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import {
  Box,
  LinearProgress,
  TextareaAutosize,
  Typography,
  Checkbox,
  Select,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'

import useStyles from './StartParty.module'
import { COUNTRIES } from '../../../utils/countryUtils'
import { ICountry } from '../../../models/Country'
import InfoIcon from '@mui/icons-material/Info'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { generateJoinToken, IStepActionsSubComponent } from '../../../utils/commonUtils'
import { CONFERENCE_API_CALLS } from '../../../services/api/conference-api-calls'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'
import { isWatchParty } from '../../../settings/variables'

interface ISetupPartyFormProps {
  onActions: IStepActionsSubComponent
  data?: ConferenceDetails
  setData: (values: ConferenceDetails) => boolean
  account?: AccountCredentials
}

export interface IPartyData {
  welcomeMsg: string
  thankMsg: string
  country: string
  partyName: string
  vipOkay: boolean
  notifyMe: boolean
}

const validationSchema = Yup.object().shape({
  welcomeMsg: Yup.string().min(1).max(2048).required('Welcome message field is required'),
  thankMsg: Yup.string().min(1).max(2048).required('Thank you message field is required'),
  partyName: Yup.string().min(1).max(256).required('Party Name field is required'),
  country: Yup.string().max(50).required('Country field is required'),
  vipOkay: Yup.boolean(),
  notifyMe: Yup.boolean(),
})

const SELECT_COUNTRIES = [{ label: 'Select Country', code: '' }, ...COUNTRIES]

const SetupPartyForm = (props: ISetupPartyFormProps) => {
  const { onActions, data, setData, account } = props
  const { classes } = useStyles()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const navigate = useNavigate()

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()
  const [conferenceJoinToken, setConferenceJoinToken] = React.useState<string | undefined>()

  const initialValues = {
    welcomeMsg: data?.welcomeMessage ?? '',
    thankMsg: data?.thankYouMessage ?? '',
    partyName: data?.displayName ?? '',
    vipOkay: data?.vipOkay ?? true,
    notifyMe: false, //TODO
    country: data?.location ?? '',
  }

  const handleReCaptchaVerify = React.useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha()

    return token
  }, [executeRecaptcha])

  const handleSubmit = async (values: IPartyData) => {
    const token = await handleReCaptchaVerify()
    if (token) {
      const joinToken = generateJoinToken()
      const conference: ConferenceDetails = {
        displayName: values.partyName,
        welcomeMessage: values.welcomeMsg,
        thankYouMessage: values.thankMsg,
        location: values.country,
        maxParticipants: 8,
        joinToken,
        vipOkay: values.vipOkay ?? true,
      } as ConferenceDetails

      if (setData(conference)) {
        // Submit
        const response = await CONFERENCE_API_CALLS.createConference(conference, account!)
        if (response.status === 201 && response.data) {
          onActions.onNextStep()
        } else {
          if (account) {
            const conferencesResponse = await CONFERENCE_API_CALLS.getAllConferences(account)

            if (conferencesResponse.status === 200 && conferencesResponse.data?.conferences.length) {
              const conf = conferencesResponse.data?.conferences[0]
              setConferenceJoinToken(conf.joinToken)

              setData({
                joinToken: conf.joinToken,
                startTime: conf.startTime,
                conferenceId: 0,
                displayName: conf.displayName,
                welcomeMessage: '',
                thankYouMessage: '',
                location: '',
                maxParticipants: 0,
                joinLocked: false,
                vipOkay: false,
                participants: [],
              })
            }
            setErrorAfterSubmit(response.statusText)
          }
        }
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => handleSubmit(values)}
      enableReinitialize
    >
      {(props: any) => {
        const { submitForm, isSubmitting, values, setFieldValue, errors, touched } = props

        const countryHandleChange = (ev: any) => {
          setFieldValue('country', ev?.target?.value)
        }

        return (
          <Form autoComplete="off" method="post">
            <Box display="flex" flexDirection="column" marginY={1} className={classes.formContainer}>
              <Field component={TextField} name="partyName" type="text" placeholder="Party Name" />
              <Field
                component={TextareaAutosize}
                type="text"
                placeholder="Welcome message"
                name="welcomeMsg"
                className={`${classes.textField} ${
                  errors.welcomeMsg && touched.welcomeMsg ? classes.errorTextField : ''
                }`}
                onChange={(ev: any) => setFieldValue('welcomeMsg', ev?.target?.value)}
                value={values.welcomeMsg}
              />
              {errors.welcomeMsg && touched.welcomeMsg && (
                <Typography className={classes.errorValidation}>{errors.welcomeMsg}</Typography>
              )}
              <Field
                component={TextareaAutosize}
                type="text"
                placeholder="Thank you message"
                name="thankMsg"
                className={`${classes.textField} ${errors.thankMsg && touched.thankMsg ? classes.errorTextField : ''}`}
                onChange={(ev: any) => setFieldValue('thankMsg', ev?.target?.value)}
                value={values.thankMsg}
              />
              {errors.thankMsg && touched.thankMsg && (
                <Typography className={classes.errorValidation}>{errors.thankMsg}</Typography>
              )}

              <Select
                id="country"
                name="country"
                placeholder="Select Country"
                onChange={countryHandleChange}
                className={`${classes.selectField} ${errors.country && touched.country ? classes.errorTextField : ''}`}
                MenuProps={{
                  style: {
                    zIndex: 13000,
                  },
                }}
                value={values.country}
              >
                {SELECT_COUNTRIES.map((country: ICountry) => {
                  return (
                    <MenuItem value={country.label} key={country.code} className={classes.menuItem}>
                      <ListItemText className={classes.item}>{country.label}</ListItemText>
                    </MenuItem>
                  )
                })}
              </Select>
              {errors.country && touched.country && (
                <Typography className={classes.errorValidation}>{errors.country}</Typography>
              )}

              {isWatchParty && (
                <Box display="flex" height="auto" alignItems="center" marginY={1}>
                  <Checkbox
                    id="vipOkay"
                    name="vipOkay"
                    className={classes.checkbox}
                    value={values.vipOkay}
                    checked={values.vipOkay ?? false}
                    onChange={(ev: any) => setFieldValue('vipOkay', ev?.target?.checked)}
                  />
                  <Typography marginX={2}>Make my party visible for special guests to join</Typography>
                  <Tooltip
                    title="Checking this box allows a special guest to join your watch party at any time during the event. These guests are directly invited to your watch party but they can add to the experience if they join"
                    arrow
                  >
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                </Box>
              )}
              {/* <Box display="flex" height="auto" alignItems="center" marginBottom={2}>
                <Checkbox
                  id="notifyMe"
                  name="notifyMe"
                  className={classes.checkbox}
                  value={values.notifyMe}
                  checked={values.notifyMe ?? false}
                  onChange={(ev: any) => setFieldValue('notifyMe', ev?.target?.checked)}
                />
                <Typography marginX={2}>Notify me about upcoming fights in this series</Typography>
              </Box> */}

              <CustomButton
                disabled={isSubmitting}
                onClick={submitForm}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
              >
                Continue
              </CustomButton>
              {isSubmitting && <LinearProgress />}

              {errorAfterSubmit && conferenceJoinToken && (
                <SimpleAlertDialog
                  title="Warning"
                  message={errorAfterSubmit}
                  onConfirm={() => onActions.onNextStep()}
                  confirmLabel="Join Conference"
                />
              )}

              {errorAfterSubmit && !conferenceJoinToken && (
                <SimpleAlertDialog
                  title="Warning"
                  message={errorAfterSubmit}
                  onConfirm={() => navigate('/join')}
                  confirmLabel="Go To Landing Page"
                />
              )}
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default SetupPartyForm
