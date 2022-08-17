import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Box, Tooltip, Typography } from '@mui/material'
import { Button, LinearProgress } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-mui'
import InfoIcon from '@mui/icons-material/Info'
import * as Yup from 'yup'

import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import Loading from '../../components/Loading/Loading'
import useQueryParams from '../../hooks/useQueryParams'
import useStyles from './JoinPage.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import MediaSetup from '../../components/MediaSetup/MediaSetup'
import MediaContext from '../../components/MediaContext/MediaContext'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'

enum Section {
  Landing = 1,
  Nickname,
  AVSetup,
}

const validationSchema = Yup.object().shape({
  nickname: Yup.string().max(50).required('Nickname field is required'),
})

// TODO: How is episode/series info accessed from this page? Wrapped in a Context Provider?
// Preferrably wrapped in a ParticipantContext/AuthContext with user/participant record?
const JoinPage = () => {
  const mediaContext = React.useContext(MediaContext.Context)

  const { classes } = useStyles()
  const query = useQueryParams()
  const params = useParams()
  const navigate = useNavigate()

  const [joinToken, setJoinToken] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | null>(null)

  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Landing)

  const initialValues = {
    nickname: '', // TODO: get from participant context or session storage?
  }

  React.useEffect(() => {
    if (params && params.token) {
      setJoinToken(params.token)
    } else {
      setJoinToken('')
    }
  }, [params])

  React.useEffect(() => {
    if (query.get('u_id')) {
      setParticipantId(query.get('u_id')) // TODO: All users are participants. Need to find out if organizer or not.
    }
  }, [query])

  React.useEffect(() => {
    if (joinToken && participantId) {
      // TODO: Get Party/Conference info for display
      getConferenceData(joinToken, participantId)
    }
  }, [joinToken, participantId])

  React.useEffect(() => {
    if (currentSection !== Section.AVSetup) {
      clearMediaContext()
    }
  }, [currentSection])

  React.useEffect(() => {
    if (conferenceData) {
      // TODO: Now go find out who is there already or invited?
    }
  }, [conferenceData])

  const getConferenceData = async (c_id: string, p_id: string) => {
    try {
      const details = await CONFERENCE_API_CALLS.getConferenceDetails(c_id)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onStartSetup = (values: any) => {
    // TODO: Access the nickname entered
    // TODO: Store nickname... in API call? in Session Storage?
    setCurrentSection(Section.AVSetup)
  }

  const onJoin = () => {
    // TODO: Define and Store media settings... in a MediaContext? in Session storage?
    // TODO: Navigate to new party page.
    navigate(`/main/${joinToken}?u_id=${participantId}`)
  }

  const onReturnToLanding = () => {
    clearMediaContext()
    setCurrentSection(Section.Landing)
  }
  const onReturnToNickname = () => {
    clearMediaContext()
    setCurrentSection(Section.Nickname)
  }
  const onStartJoin = () => setCurrentSection(Section.Nickname)

  return (
    <>
      <Box className={classes.root}>
        <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 400 }}>
          Join WatchParty
        </Typography>
        {!conferenceData && <Loading />}
        {conferenceData && currentSection === Section.Landing && (
          <Box className={classes.landingContainer}>
            <p>TODO: Episode/Series Info?</p>
            <Typography sx={{ fontSize: '24px' }}>Series 1</Typography>
            <Typography variant="h1">Event 1</Typography>
            <Box display="flex" alignItems="center" sx={{ marginTop: '24px' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>08 July - 09:00 PM</Typography>
              <Tooltip title="TODO: What is this?" arrow sx={{ marginLeft: '12px' }}>
                <InfoIcon fontSize="small" />
              </Tooltip>
            </Box>
            <Box className={classes.conferenceDetails}>
              <Typography sx={{ fontSize: '36px', fontWeight: 600 }}>{conferenceData.displayName}</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
              <p>TODO: Participant listing...</p>
              <CustomButton
                className={classes.landingJoin}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
                onClick={onStartJoin}
              >
                Join Party
              </CustomButton>
            </Box>
          </Box>
        )}
        {conferenceData && currentSection === Section.Nickname && (
          <Box className={classes.nicknameContainer}>
            <p>TODO: Episode/Series Info?</p>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Event 1</Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>08 July - 09:00 PM</Typography>
            <Typography marginTop={2} sx={{ fontSize: '36px', fontWeight: 600 }}>
              {conferenceData.displayName}
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
            <p>TODO: Participant listing...</p>
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
                  // TODO: Store name somewhere?
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
                      <Button
                        color="inherit"
                        disabled={isSubmitting}
                        onClick={onReturnToLanding}
                        className={classes.backButton}
                      >
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
        )}
        {conferenceData && currentSection === Section.AVSetup && (
          <Box className={classes.mediaSetupContainer}>
            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
              Choose your camera and microphone preferences
            </Typography>
            <MediaSetup selfCleanup={false} />
            <Box className={classes.mediaSetupButtons}>
              <Button
                color="inherit"
                onClick={onReturnToNickname}
                className={classes.backButton}
                sx={{ position: 'absolute', left: 0 }}
              >
                <ArrowBackIosIcon />
              </Button>
              <CustomButton
                disabled={!mediaContext?.mediaStream}
                size={BUTTONSIZE.MEDIUM}
                buttonType={BUTTONTYPE.SECONDARY}
                onClick={onJoin}
              >
                Join
              </CustomButton>
            </Box>
          </Box>
        )}
      </Box>
    </>
  )
}

export default JoinPage
