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
  nickname: Yup.string().max(256).min(4).required('Nickname field is required'),
})

interface JoinNickNameProps {
  nickname: string
  seriesEpisode?: any
  conferenceData?: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onBack?(): any
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
      {seriesEpisode && (
        <>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{seriesEpisode.episode.displayName}</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
            {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
          </Typography>
        </>
      )}
      {conferenceData && (
        <>
          <Typography marginTop={2} sx={{ fontSize: '36px', fontWeight: 600 }}>
            {conferenceData.displayName}
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
          <Typography paddingTop={2} sx={{ fontSize: '12px', fontWeight: 500 }}>
            {conferenceParticipantsStringBuilder(conferenceData.participants)}
          </Typography>
        </>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => onStartSetup(values)}
        enableReinitialize
      >
        {(props: any) => {
          const { submitForm, isSubmitting } = props

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
                {onBack && (
                  <Button color="inherit" disabled={isSubmitting} onClick={onBack} className={classes.backButton}>
                    <ArrowBackIosIcon />
                  </Button>
                )}
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
