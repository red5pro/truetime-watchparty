import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Button, LinearProgress } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-mui'
import * as Yup from 'yup'

import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import Loading from '../../components/Loading/Loading'
import useQueryParams from '../../hooks/useQueryParams'
import useStyles from './JoinPage.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import MediaSetup from '../../components/MediaSetup/MediaSetup'
import MediaContext from '../../components/MediaContext/MediaContext'

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

  const [conferenceId, setConferenceId] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | null>(null)

  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Landing)

  const initialValues = {
    nickname: '', // TODO: get from participant context or session storage?
  }

  React.useEffect(() => {
    if (params && params.conferenceid) {
      setConferenceId(params.conferenceid)
    } else {
      setConferenceId('')
    }
  }, [params])

  React.useEffect(() => {
    if (query.get('u_id')) {
      setParticipantId(query.get('u_id')) // TODO: All users are participants. Need to find out if organizer or not.
    }
  }, [query])

  React.useEffect(() => {
    if (conferenceId && participantId) {
      // TODO: Get Party/Conference info for display
      getConferenceData(conferenceId, participantId)
    }
  }, [conferenceId, participantId])

  React.useEffect(() => {
    if (conferenceData) {
      // TODO: Now go find out who is there already or invited?
    }
  }, [conferenceData])

  const getConferenceData = async (c_id: string, p_id: string) => {
    try {
      // TODO: Get credentials from somewhere?
      const username = 'user'
      const password = 'pass'
      const details = await CONFERENCE_API_CALLS.getConferenceDetails(c_id, username, password)
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
    navigate(`/main/${conferenceId}?u_id=${participantId}`)
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
        <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
          Join WatchParty
        </Typography>
        {!conferenceData && <Loading />}
        {conferenceData && currentSection === Section.Landing && (
          <>
            <p>TODO: Episode/Series Info?</p>
            <p>{conferenceData.displayName}</p>
            <p>{conferenceData.welcomeMessage}</p>
            <p>TODO: Participant listing...</p>
            <button onClick={onStartJoin}>Join Party</button>
          </>
        )}
        {conferenceData && currentSection === Section.Nickname && (
          <>
            <p>TODO: Episode/Series Info?</p>
            <p>{conferenceData.displayName}</p>
            <p>{conferenceData.welcomeMessage}</p>
            <p>TODO: Participant listing...</p>
            <p>Choose a Nickname</p>
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
                  <Form>
                    <Box display="flex" width="30%" margin="auto" className={classes.formContainer}>
                      <Field
                        component={TextField}
                        name="nickname"
                        type="text"
                        label="Nickname / Display Name"
                        className={classes.inputField}
                      />
                    </Box>
                    <Button variant="contained" color="primary" disabled={isSubmitting} onClick={onReturnToLanding}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
                      Next
                    </Button>
                  </Form>
                )
              }}
            </Formik>
          </>
        )}
        {conferenceData && currentSection === Section.AVSetup && (
          <>
            <p>Choose your camera and mic preferences</p>
            <MediaSetup selfCleanup={false} />
            <button onClick={onReturnToNickname}>back</button>
            <button onClick={onJoin}>join</button>
          </>
        )}
      </Box>
    </>
  )
}

export default JoinPage
