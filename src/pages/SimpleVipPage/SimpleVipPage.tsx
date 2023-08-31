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
import { Box, LinearProgress, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-mui'
import React from 'react'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import useStyles from './SimpleVipPage.module'
import MediaContext from '../../components/MediaContext/MediaContext'
import WatchContext from '../../components/WatchContext/WatchContext'
import JoinContext from '../../components/JoinContext/JoinContext'
import Loading from '../../components/Common/Loading/Loading'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { API_SOCKET_HOST, STREAM_HOST, USE_STREAM_MANAGER, PREFER_WHIP_WHEP } from '../../settings/variables'
import { FatalError } from '../../models/FatalError'
import ErrorModal from '../../components/Modal/ErrorModal'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'
import { Participant } from '../../models/Participant'
import Publisher from '../../components/Publisher/Publisher'
import MainStageSubscriber from '../../components/MainStageSubscriber/MainStageSubscriber'
import { PublisherRef } from '../../components/Publisher'

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
  const publisherRef = React.useRef<PublisherRef>(null)

  const [vipData, dispatch] = React.useReducer(vipReducer, {
    token: undefined,
    email: undefined,
    password: undefined,
  })
  const [startMedia, setStartMedia] = React.useState<boolean>()
  const [isInConference, setIsInConference] = React.useState<boolean>()
  const [participants, setParticipants] = React.useState<Participant[]>([])
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const getSocketUrl = (token: string, email: string, password: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: 'VIP Guest',
      joinToken: token,
      streamGuid: guid,
      fingerprint: fingerprint,
      messageType: 'JoinConferenceRequest',
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

  React.useEffect(() => {
    // Fatal Socket Error.
    if (errorContext) {
      setFatalError({
        ...(errorContext as any),
        title: 'Connection Error',
        closeLabel: 'CLOSE',
        onClose: () => {
          setFatalError(undefined)
          window.location.reload()
        },
      } as FatalError)
    }
  }, [errorContext])

  React.useEffect(() => {
    if (data?.list) {
      setParticipants(data.list)
    }
  }, [data?.list])

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

  const onPublisherBroadcast = () => {
    // TODO?
  }

  const onPublisherBroadcastInterrupt = () => {
    setFatalError({
      status: 400,
      title: 'Broadcast Stream Error',
      statusText: `Your broadcast session was interrupted expectedly. You are no longer streaming.`,
      closeLabel: 'Restart',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  const onPublisherFail = () => {
    setFatalError({
      status: 404,
      title: 'Broadcast Stream Error',
      statusText: `Could not start a broadcast.`,
      closeLabel: 'Retry',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
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
      {isInConference && (
        <Box className={classes.watchContainer}>
          <Publisher
            key="publisher"
            ref={publisherRef}
            useStreamManager={USE_STREAM_MANAGER}
            preferWhipWhep={PREFER_WHIP_WHEP}
            host={STREAM_HOST}
            streamGuid={getStreamGuid()}
            stream={mediaStream}
            styles={{
              width: '320px',
              height: '240px',
            }}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          />
          <Box className={classes.subscriberContainer}>
            {participants.map((s: Participant) => {
              return (
                <MainStageSubscriber
                  key={s.participantId}
                  participant={s}
                  styles={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                  }}
                  videoStyles={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  host={STREAM_HOST}
                  useStreamManager={USE_STREAM_MANAGER}
                  preferWhipWhep={PREFER_WHIP_WHEP}
                  menuActions={undefined}
                />
              )
            })}
          </Box>
        </Box>
      )}
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
