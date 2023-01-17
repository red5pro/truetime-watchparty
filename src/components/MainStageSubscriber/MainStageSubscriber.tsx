import { Box, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'
import SubscriberMenu from '../SubscriberMenu/SubscriberMenu'
import { ENABLE_DEBUG_UTILS } from '../../settings/variables'

interface MainStageSubscriberProps {
  participant: Participant
  host: string
  useStreamManager: boolean
  styles: any
  videoStyles: any
  menuActions?: any
  onSubscribeStart?(): any
  isLayoutFullscreen?: boolean
}

const MainStageSubscriber = (props: MainStageSubscriberProps) => {
  const {
    participant,
    host,
    useStreamManager,
    styles,
    videoStyles,
    menuActions,
    onSubscribeStart,
    isLayoutFullscreen,
  } = props

  return (
    // TODO: Set `mute` to false for production
    // TODO: Set `resubscribe` to true for production
    <Box sx={{ ...styles, position: 'relative' }}>
      <Subscriber
        host={host}
        useStreamManager={useStreamManager}
        mute={false}
        showControls={false}
        streamGuid={participant.streamGuid}
        resubscribe={true}
        styles={styles}
        videoStyles={videoStyles}
        isAudioOff={participant?.muteState?.audioMuted}
        isVideoOff={participant?.muteState?.videoMuted}
        onSubscribeStart={onSubscribeStart}
      />
      {participant && menuActions && (
        <Box sx={{ position: 'absolute', top: 4, right: `${isLayoutFullscreen ? '17%' : '4px'}` }}>
          <SubscriberMenu participant={participant} actions={menuActions} />
        </Box>
      )}
      {participant && !menuActions && ENABLE_DEBUG_UTILS && (
        <Tooltip title={`${participant.displayName}`} arrow>
          <InfoIcon
            fontSize="small"
            sx={{ position: 'absolute', top: 4, right: `${isLayoutFullscreen ? '4px' : '4px'}` }}
          />
        </Tooltip>
      )}
    </Box>
  )
}

export default MainStageSubscriber
