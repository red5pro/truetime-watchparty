import * as React from 'react'
import * as Yup from 'yup'
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
import { IStepActionsSubComponent } from '../HostAPartySteps'
import useStyles from './StartParty.module'
import { COUNTRIES } from '../../../utils/countryUtils'
import { ICountry } from '../../../models/Country'
import InfoIcon from '@mui/icons-material/Info'
import { CONFERENCE_API_CALLS } from '../../../services/api/conference-api-calls'
import { IConference } from '../../../models/Conference'
import { IAccount } from '../../../models/Account'
import { generateJoinToken } from '../../../utils/commonUtils'

interface ISetupPartyFormProps {
  onActions: IStepActionsSubComponent
  data?: IConference
  setData: (values: IConference) => void
  account?: IAccount
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
  welcomeMsg: Yup.string().max(50).required('Welcome message field is required'),
  thankMsg: Yup.string().max(150).required('Thank you message field is required'),
  partyName: Yup.string().max(150).required('Party Name field is required'),
  country: Yup.string().max(50).required('Country field is required'),
  vipOkay: Yup.boolean(),
  notifyMe: Yup.boolean(),
})

const SELECT_COUNTRIES = [{ label: 'Select Country', code: '' }, ...COUNTRIES]

const SetupPartyForm = (props: ISetupPartyFormProps) => {
  const { onActions, data, setData, account } = props
  const { classes } = useStyles()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [errorAfterSubmit, setErrorAfterSubmit] = React.useState<string | undefined>()

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

      const conference: IConference = {
        displayName: values.partyName,
        welcomeMessage: values.welcomeMsg,
        thankYouMessage: values.thankMsg,
        location: values.country,
        maxParticipants: 8,
        joinToken,
        joinLocked: false,
        vipOkay: values.vipOkay ?? true,
      }
      setData(conference)

      const response = await CONFERENCE_API_CALLS.createConference(conference, account)

      if (response.data) {
        onActions.onNextStep()
      } else {
        setErrorAfterSubmit(response.statusText)
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
            <Box display="flex" flexDirection="column" marginY={4} className={classes.formContainer}>
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
                {...props}
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

              <Box display="flex" height="auto" alignItems="center" marginY={2}>
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

export default SetupPartyForm
