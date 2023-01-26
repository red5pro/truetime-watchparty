import * as React from 'react'
import { Box } from '@mui/material'
import Subscriber from '../Subscriber/Subscriber'
import { Participant } from '../../models/Participant'

interface ScreenShareSubscriberProps {
  participantScreenshare: Participant
  host: string
  useStreamManager: boolean
  styles: any
  videoStyles?: any
  onSubscribeStart?(): any
}

const ScreenShareSubscriber = (props: ScreenShareSubscriberProps) => {
  const { participantScreenshare, host, useStreamManager, styles, onSubscribeStart } = props

  const videoStyles = { objectFit: 'contain', height: '100%', width: '100%' }

  return (
    <Box sx={{ ...styles, position: 'relative' }}>
      <Subscriber
        host={host}
        useStreamManager={useStreamManager}
        mute={false}
        showControls={false}
        streamGuid={participantScreenshare.screenshareGuid || ''}
        resubscribe={true}
        styles={styles}
        videoStyles={videoStyles}
        onSubscribeStart={onSubscribeStart}
      />
    </Box>
  )
}

export default ScreenShareSubscriber
