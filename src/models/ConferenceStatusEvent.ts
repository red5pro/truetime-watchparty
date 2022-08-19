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
