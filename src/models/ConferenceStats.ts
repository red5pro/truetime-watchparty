import { ConferenceData } from './Conference'

export interface AllConferenceStats {
  avgParticipants: number
  avgViewTimeS: number
  curConferences: number
  curParticipants: number
  devParticipants: number
  devViewTimeS: number
  maxConferences: number
  maxParticipants: number
  maxViewTimeS: number
  totalConferences: number
  totalParticipants: number
  totalViewTimeS: number
}

export interface StatsByConference extends ConferenceData {
  conferenceId: number
  episodeId: number
  streamGuid: string
  displayName: string
  vipOkay: boolean
  vipVisited: boolean
  startTimeMs: number
  endTimeMs: number
  numKicked: number
  maxParticipants: number
  totalParticipants: number
  maxViewTimeS: number
  totalViewTimeS: number
  avgViewTimeS: number
  devViewTimeS: number
  curParticipants: number
}
