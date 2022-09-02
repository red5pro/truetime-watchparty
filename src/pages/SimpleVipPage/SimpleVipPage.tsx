import { Box, LinearProgress, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import React from 'react'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import useStyles from './SimpleVipPage.module'
import MediaContext from '../../components/MediaContext/MediaContext'
import WatchContext from '../../components/WatchContext/WatchContext'
import JoinContext from '../../components/JoinContext/JoinContext'
import Loading from '../../components/Loading/Loading'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { API_SOCKET_HOST } from '../../settings/variables'
import { FatalError } from '../../models/FatalError'
import ErrorModal from '../../components/Modal/ErrorModal'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)

const vipReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, token: action.token, email: action.email, password: action.password }
  }
}

const Page = () => {
  const { mediaStream, setConstraints, setMediaStream } = useMediaContext()
  const { loading, error, data, join, leave } = useWatchContext()
  const {
    loading: loadingContext,
    error: errorContext,
    conferenceData,
    fingerprint,
    setJoinToken,
    getStreamGuid,
  } = useJoinContext()

  const { classes } = useStyles()

  const [vipData, dispatch] = React.useReducer(vipReducer, {
    token: undefined,
    email: undefined,
    password: undefined,
  })
  const [startMedia, setStartMedia] = React.useState<boolean>()
  const [isInConference, setIsInConference] = React.useState<boolean>()
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const getSocketUrl = (token: string, email: string, password: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: 'VIP Guest',
      joinToken: token,
      streamGuid: guid,
      fingerprint: fingerprint,
      username: email,
      password,
    } as ConnectionRequest

    return { url: API_SOCKET_HOST, request }
  }

  const clearMediaContext = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      setConstraints(undefined)
      setMediaStream(undefined)
    }
  }

  React.useEffect(() => {
    if (!mediaStream && !startMedia && !isInConference) {
      clearMediaContext()
    }
  }, [mediaStream, startMedia, isInConference])

  React.useEffect(() => {
    if (vipData?.token) {
      setJoinToken(vipData.token)
    }
  }, [vipData])

  React.useEffect(() => {
    if (vipData?.token && conferenceData) {
      console.log('CONFERENCE', conferenceData)
      setStartMedia(true)
    }
  }, [vipData, conferenceData])

  React.useEffect(() => {
    // Fatal Socket Error.
    if (error) {
      setFatalError({
        ...(error as any),
        title: 'Connection Error',
        closeLabel: 'CLOSE',
        onClose: () => {
          setFatalError(undefined)
          window.location.reload()
        },
      } as FatalError)
    }
  }, [error])

  const onJoin = () => {
    if (vipData?.token && mediaStream) {
      const { token, email, password } = vipData
      const { url, request } = getSocketUrl(token, email, password, getStreamGuid())
      join(url, request)
      setIsInConference(true)
    }
  }

  const handleSubmit = (value: any) => {
    const { joinToken, email, password } = value
    if (joinToken?.length > 0 && email?.length > 0 && password?.length > 0) {
      dispatch({ type: 'UPDATE', token: joinToken, email: email, password: password })
    }
  }

  const initialValues = {
    joinToken: '',
    email: 'toddvip@infrared5.com',
    password: '!red5prO',
  }

  return (
    <Box className={classes.root}>
      {!startMedia && (
        <Formik initialValues={initialValues} onSubmit={async (values) => handleSubmit(values)} enableReinitialize>
          {(props: any) => {
            const { submitForm, isSubmitting } = props

            const handleKeyPress = (ev: any) => {
              if (ev && ev.code === 'Enter') {
                submitForm()
              }
            }

            return (
              <Form method="post" className={classes.form}>
                <Box display="flex" flexDirection="column" marginY={4} className={classes.formContainer}>
                  <Typography marginY={2}>Enter Join Token</Typography>
                  <Field component={TextField} name="email" type="text" label="Email" placeholder="Email" />
                  <Field component={TextField} name="password" type="text" label="Password" placeholder="Password" />
                  <Field
                    component={TextField}
                    name="joinToken"
                    type="text"
                    label="Join Token"
                    placeholder="Join Token"
                    onKeyPress={handleKeyPress}
                  />
                  <CustomButton
                    disabled={isSubmitting}
                    onClick={submitForm}
                    size={BUTTONSIZE.MEDIUM}
                    buttonType={BUTTONTYPE.SECONDARY}
                    fullWidth
                  >
                    Submit
                  </CustomButton>
                  {isSubmitting && <LinearProgress />}
                </Box>
              </Form>
            )
          }}
        </Formik>
      )}
      {startMedia && !isInConference && (
        <Box>
          <JoinSectionAVSetup onJoin={onJoin} shouldDisplayBackButton={false} />
        </Box>
      )}
      {isInConference && <Box>Welcome</Box>}
      {loadingContext && (
        <Box margin={4}>
          <Loading text="Loading Watch Party..." />
        </Box>
      )}
      {loading && (
        <Box margin={4}>
          <Loading text="Connecting to Party..." />
        </Box>
      )}
      {/* Fatal Error */}
      {fatalError && (
        <ErrorModal
          open={!!fatalError}
          title={fatalError.title || 'Error'}
          message={fatalError.statusText}
          closeLabel={fatalError.closeLabel || 'OK'}
          onClose={fatalError.onClose}
        ></ErrorModal>
      )}
    </Box>
  )
}

const SimpleVipPage = () => {
  return (
    <JoinContext.Provider>
      <MediaContext.Provider>
        <WatchContext.Provider>
          <Page />
        </WatchContext.Provider>
      </MediaContext.Provider>
    </JoinContext.Provider>
  )
}

export default SimpleVipPage
