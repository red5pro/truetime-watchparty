import { Participant } from '../../models/Participant'
import Subscriber from '../Subscriber/Subscriber'

interface MainStageSubscriberProps {
  participant: Participant
  host: string
  useStreamManager: boolean
  styles: any
  videoStyles: any
}

const MainStageSubscriber = (props: MainStageSubscriberProps) => {
  const { participant, host, useStreamManager, styles, videoStyles } = props

  return (
    <Subscriber
      host={host}
      useStreamManager={useStreamManager}
      mute={true}
      showControls={false}
      streamGuid={participant.streamGuid}
      resubscribe={false}
      styles={styles}
      videoStyles={videoStyles}
    />
  )
}

export default MainStageSubscriber
