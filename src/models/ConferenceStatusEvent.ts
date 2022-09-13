import { Participant } from './Participant'

export interface ConferenceState {
  conferenceId: number
  organizerId: number
  streamGuid: string
  displayName: string
  joinLocked: boolean
  vipOkay: boolean
  participants: Participant[]
}

export interface NextVipConference {
  conferenceId: number
  displayName: string
  joinToken: string
  vipOkay: boolean
  vipVisited: boolean
  numParticipants: number
}

export interface ConferenceStatusEvent {
  messageType: string
  state: ConferenceState
}

export interface ConnectionRequest {
  displayName: string
  streamGuid: string
  joinToken: string
  messageType: string
  fingerprint?: string
  username?: string
  password?: string
}

export interface ConnectionResult {
  messageType: string
  particpantId?: number
  role?: string
  error?: string
}

export interface NextConferenceToJoin {
  conferenceId: number
  joinToken: string
}
