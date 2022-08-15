import { Participant } from './Participant'

export interface ConferenceStatusEvent {
  conferenceId: number
  streamGuid: string
  displayName: string
  maxParticipants: number
  focusParticipantId: number
  joinToken: string
  joinLocked: boolean
  vipOkay: boolean
  startTime: number
  participants: Participant[]
}
