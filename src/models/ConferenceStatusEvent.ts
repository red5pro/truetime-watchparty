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
  joinToken: string
  messageType: string
  fingerprint: string
  isAnonymous: boolean
  displayName?: string
  streamGuid?: string
  username?: string
  password?: string
  auth?: string
  accessToken?: string
}

export interface SharescreenRequest {
  messageType: string
  screenshareGuid: string | null
}

export interface ConnectionResult {
  messageType: string
  particpantId?: number
  role?: string
  error?: string
}

export interface NextVipConference {
  conferenceId: number
  organizerId: number
  streamGuid: string
  displayName: string
  joinLocked: boolean
  vipOkay: boolean
  participants: number
}

export interface NextConferenceToJoin {
  conferenceId: number
  joinToken: string
}
