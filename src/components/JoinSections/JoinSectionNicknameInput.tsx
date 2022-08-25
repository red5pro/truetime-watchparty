import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import * as Yup from 'yup'

import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Participant } from '../../models/Participant'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'

const validationSchema = Yup.object().shape({
  nickname: Yup.string().max(50).required('Nickname field is required'),
})

interface JoinNickNameProps {
  nickname: string
  seriesEpisode: any
  conferenceData: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onBack(): any
  onStartSetup(values: any): any
}

const JoinSectionNicknameInput = (props: JoinNickNameProps) => {
  const { nickname, seriesEpisode, conferenceData, conferenceParticipantsStringBuilder, onBack, onStartSetup } = props

  const { classes } = useStyles()

  const initialValues = {
    nickname: nickname || '',
  }

  return (
    <Box className={classes.nicknameContainer}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{seriesEpisode.episode.displayName}</Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
        {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
      </Typography>
      <Typography marginTop={2} sx={{ fontSize: '36px', fontWeight: 600 }}>
        {conferenceData.displayName}
      </Typography>
      <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
      <Typography paddingTop={2} sx={{ fontSize: '12px', fontWeight: 500 }}>
        {conferenceParticipantsStringBuilder(conferenceData.participants)}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => onStartSetup(values)}
        enableReinitialize
      >
        {(props: any) => {
          const { submitForm, isSubmitting, setFieldValue } = props

          const nicknameChange = (e: any) => {
            const value = e?.target?.value
          }

          return (
            <Form autoComplete="off" className={classes.nicknameForm}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Choose a Nickname</Typography>
              <Box display="flex" width="30%" margin="auto" className={classes.formContainer}>
                <Field
                  component={TextField}
                  name="nickname"
                  type="text"
                  placeholder="Nickname"
                  className={classes.inputField}
                />
              </Box>
              <Box display="flex" marginY={4} className={classes.buttonContainer}>
                <Button color="inherit" disabled={isSubmitting} onClick={onBack} className={classes.backButton}>
                  <ArrowBackIosIcon />
                </Button>
                <CustomButton
                  size={BUTTONSIZE.MEDIUM}
                  buttonType={BUTTONTYPE.SECONDARY}
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Next
                </CustomButton>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}

export default JoinSectionNicknameInput