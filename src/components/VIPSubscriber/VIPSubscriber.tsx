import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'

interface VIPSubscriber {
  participant: Participant
  host: string
  useStreamManager: boolean
  styles: any
  videoStyles: any
}

const VIPSubscriber = (props: VIPSubscriber) => {
  const { participant, host, useStreamManager, styles, videoStyles } = props

  return (
    <Subscriber
      host={host}
      useStreamManager={useStreamManager}
      mute={false}
      showControls={false}
      streamGuid={participant.streamGuid}
      resubscribe={true}
      styles={styles}
      videoStyles={videoStyles}
    />
  )
}

export default VIPSubscriber
