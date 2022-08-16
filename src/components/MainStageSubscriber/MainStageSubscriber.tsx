import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'

interface MainStageSubscriberProps {
  participant: Participant
  host: string
  useStreamManager: boolean
  styles: any
}

const MainStageSubscriber = (props: MainStageSubscriberProps) => {
  const { participant, host, useStreamManager, styles } = props

  return (
    <Subscriber
      host={host}
      useStreamManager={useStreamManager}
      mute={false}
      showControls={false}
      streamGuid={participant.streamGuid}
      resubscribe={true}
      styles={styles}
    />
  )
}

export default MainStageSubscriber
