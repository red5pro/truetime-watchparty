import { Participant } from './Participant'
import { ConferenceData } from './Conference'

export interface LiveConference {
  conference: ConferenceData
  participants: [Participant]
}
