import { Box } from '@mui/material'
import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'

interface VIPSubscriber {
  participant: Participant
  host: string
  useStreamManager: boolean
  preferWhipWhep: boolean
  styles: any
  videoStyles: any
}

const VIPSubscriber = (props: VIPSubscriber) => {
  const { participant, host, useStreamManager, preferWhipWhep, styles, videoStyles } = props

  return (
    <Box sx={{ position: 'relative' }}>
      <Subscriber
        host={host}
        useStreamManager={useStreamManager}
        preferWhipWhep={preferWhipWhep}
        mute={false}
        showControls={false}
        streamGuid={participant.streamGuid}
        resubscribe={true}
        styles={styles}
        videoStyles={videoStyles}
      />
      <Box sx={{ width: 'auto', height: '50px', position: 'absolute', bottom: 10, right: 10 }}>
        <img
          width="100%"
          height="100%"
          alt="Logo Placeholder"
          src="../../assets/logos/sponsor-placeholder-logo.png"
          style={{
            borderRadius: '6px',
            backdropFilter: 'contrast(0.5)',
          }}
        ></img>
      </Box>
    </Box>
  )
}

export default VIPSubscriber
