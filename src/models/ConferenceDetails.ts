export interface ConferenceDetails {
  conferenceId: number
  streamGuid: string // "context/name"
  displayName: string
  welcomeMessage: string
  thankYouMessage: string
  location: string
  maxParticipants: number
  joinToken: string
  joinLocked: boolean
  vipOkay: boolean
  startTime: number
}
