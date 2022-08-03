import { RTCPublisherEventTypes } from 'red5pro-webrtc-sdk'
import * as React from 'react'
import WatchContext from '../WatchContext/WatchContext'
import Loading from '../Loading/Loading'
import MainVideo from '../MainVideo/MainVideo'
import { Box, Typography } from '@mui/material'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import useParticipantStyles from './Participant.module'
import SubscribersPanelList from '../SubscribersPanel/SubscribersPanelList'
import JoinPartyPreview from '../JoinPartyPreview/JoinPartyPreview'

const Participant = () => {
  const watchContext = React.useContext(WatchContext.Context)

  const [isPublished, setIsPublished] = React.useState<boolean>(false)
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false)
  const [bitrateTrackingTicket, setBitrateTrackingTicket] = React.useState<string>('')
  const [publisher, setPublisher] = React.useState<any>()

  const { classes } = useParticipantStyles()

  const onPublisherEvent = (event: any) => {
    if (event.type === 'WebSocket.Message.Unhandled') {
      console.log(event)
    } else if (event.type === RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE) {
      //      window.allowMediaStreamSwap(targetPublisher, targetPublisher.getOptions().mediaConstraints, document.getElementById('red5pro-publisher'));
    } else if (event.type === 'Publisher.Connection.Closed') {
      notifyOfPublishFailure()
    }
    watchContext.methods.updateSuscriberStatusFromEvent(event)
    return
  }

  const notifyOfPublishFailure = () => {
    console.log('There seems to be an issue with broadcasting your stream. Please reload this page and join again.')
    alert('There seems to be an issue with broadcasting your stream. Please reload this page and join again.')
  }

  const hangOff = async () => {
    try {
      const { hostSocket, setHostSocket } = watchContext

      setHostSocket(hostSocket.close())

      publisher.unpublish().then(() => {
        publisher.off('*', onPublisherEvent)
        window.location.href = '/'
      })
      watchContext.methods.untrackBitrate(bitrateTrackingTicket)
    } catch (error) {
      console.log(error)
      window.location.href = '/'
    }
  }

  return (
    <>
      <Typography component="h5" variant="h5" textAlign="center" margin={3}>
        Join the event!
      </Typography>
      {!isPublished && !isPublishing && (
        <JoinPartyPreview
          setIsPublished={setIsPublished}
          setIsPublishing={setIsPublishing}
          setPublisher={setPublisher}
          setBitrateTrackingTicket={setBitrateTrackingTicket}
          onPublisherEvent={onPublisherEvent}
        />
      )}
      {!isPublished && isPublishing && <Loading />}
      {isPublished && (
        <Box display="flex">
          <Box width="75%">
            <MainVideo />
          </Box>
          <Box width="25%">
            <SubscribersPanelList />
          </Box>
          <Box className={classes.hangOff}>
            <PhoneDisabledIcon fontSize="large" onClick={hangOff} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default Participant
