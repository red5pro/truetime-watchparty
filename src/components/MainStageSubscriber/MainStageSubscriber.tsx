import { Box } from '@mui/material'
import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'
import SubscriberMenu from '../SubscriberMenu/SubscriberMenu'

interface MainStageSubscriberProps {
  participant: Participant
  host: string
  useStreamManager: boolean
  styles: any
  videoStyles: any
  menuActions?: any
}

const MainStageSubscriber = (props: MainStageSubscriberProps) => {
  const { participant, host, useStreamManager, styles, videoStyles, menuActions } = props

  console.log(participant?.muteState)
  return (
    // TODO: Set `mute` to false for production
    <Box sx={menuActions ? { ...styles, position: 'relative' } : {}}>
      <Subscriber
        host={host}
        useStreamManager={useStreamManager}
        mute={true}
        showControls={false}
        streamGuid={participant.streamGuid}
        resubscribe={false}
        styles={styles}
        videoStyles={videoStyles}
        isAudioOff={participant?.muteState?.audioMuted}
        isVideoOff={participant?.muteState?.videoMuted}
      />
      {participant && menuActions && (
        <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
          <SubscriberMenu participant={participant} actions={menuActions} />
        </Box>
      )}
    </Box>
  )
}

export default MainStageSubscriber
