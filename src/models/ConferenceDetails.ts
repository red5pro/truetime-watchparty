import { Participant } from './Participant'

export interface ConferenceDetails {
  conferenceId: number
  displayName: string
  welcomeMessage: string
  thankYouMessage: string
  location: string
  maxParticipants: number
  joinToken: string
  joinLocked: boolean
  vipOkay: boolean
  startTime: number
  participants: Participant[]
}
