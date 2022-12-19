import * as React from 'react'
import { Box } from '@mui/material'
import { AccountBox } from '@mui/icons-material'
import useStyles from './Screenshare.module'
import MediaContext from '../MediaContext/MediaContext'
import { API_SOCKET_HOST, STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import JoinContext from '../JoinContext/JoinContext'
import { FatalError } from '../../models/FatalError'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import WatchContext from '../WatchContext/WatchContext'
import useCookies from '../../hooks/useCookies'
import { PublisherRef } from '../Publisher'
import VideoElement from '../VideoElement/VideoElement'
import PublishScreen from '../Publisher/PublishScreen'

const SimpleAlertDialog = React.lazy(() => import('../Modal/SimpleAlertDialog'))

interface SubscriberRef {
  setVolume(value: number): any
}

interface ISubscriberProps {
  styles: any
  videoStyles: AnalyserOptions | any
  isSharingScreen: boolean
  onShareScreen: (value: boolean) => void
}

const useMediaContext = () => React.useContext(MediaContext.Context)
const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)

const ScreenShare = React.forwardRef(function Subscriber(props: ISubscriberProps, ref: React.Ref<SubscriberRef>) {
  const { styles, isSharingScreen, onShareScreen /*, publishMediaStream, setPublishMediaStream*/ } = props

  const { startVideoMedia, screenshareMediaStream } = useMediaContext()
  const { joinToken, fingerprint, nickname, getSharescreenStreamGuid } = useJoinContext()
  const { join } = useWatchContext()

  const { getCookies } = useCookies(['account'])
  const { classes } = useStyles()

  const screensharePublisherRef = React.useRef<PublisherRef>(null)

  const [initScreenShare, setInit] = React.useState<boolean>(false)

  const [error, setError] = React.useState<any>()
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()

  const subRef = React.useRef()

  React.useEffect(() => {
    if (isSharingScreen) {
      setInit(true)
    }
  }, [isSharingScreen])

  React.useEffect(() => {
    if (initScreenShare) {
      startScreenShare()
    }
  }, [initScreenShare])

  const startScreenShare = async () => {
    const videoStarted = await startVideoMedia()

    if (!videoStarted) {
      onShareScreen(false)
    }
  }

  const getSocketUrl = (token: string, name: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
      messageType: 'JoinConferenceRequest',
    } as ConnectionRequest

    const fp = fingerprint
    request.fingerprint = fp
    const cookies = getCookies()
    if (cookies?.account) {
      // Registered User
      if (cookies.account.token) {
        const { auth, token } = cookies.account
        request.auth = auth
        request.accessToken = token
      } else {
        const { email, password } = cookies.account
        request.username = email
        request.password = password
      }
    }

    return { url: API_SOCKET_HOST, request }
  }

  const onPublisherBroadcast = () => {
    const streamGuid = getSharescreenStreamGuid()

    const { url, request } = getSocketUrl(joinToken, nickname, streamGuid)
    join(url, request)
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

  const onPublisherBroadcastInterrupt = () => {
    setFatalError({
      status: 400,
      title: 'Broadcast Stream Error',
      statusText: `Your broadcast session was interrupted unexpectedly. You are no longer streaming.`,
      closeLabel: 'Restart',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  return (
    <Box className={classes.container} sx={styles}>
      {!initScreenShare && <AccountBox fontSize="large" className={classes.accountIcon} />}
      {screenshareMediaStream && (
        <>
          {/* <PublishScreen
            ref={screensharePublisherRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={getSharescreenStreamGuid()}
            stream={screenshareMediaStream}
            styles={{}}
            onFail={onPublisherFail}
            onStart={onPublisherBroadcast}
            onInterrupt={onPublisherBroadcastInterrupt}
          /> */}
          <VideoElement
            elementId={screenshareMediaStream.id}
            muted={true}
            controls={false}
            styles={{}}
            initScreenShare
            videoMedia={screenshareMediaStream}
          />
        </>
      )}
      {error && (
        <SimpleAlertDialog
          title={error.title || 'Error'}
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="OK"
          onConfirm={() => setError(undefined)}
        />
      )}
      {fatalError && (
        <SimpleAlertDialog
          title={fatalError.title || 'Error'}
          message={`${fatalError.status} - ${fatalError.statusText}`}
          confirmLabel="OK"
          onConfirm={() => setError(undefined)}
        />
      )}
    </Box>
  )
})

export default ScreenShare
