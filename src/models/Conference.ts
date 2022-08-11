export interface IConference {
  displayName: string
  welcomeMessage: string
  thankYouMessage: string
  location: string
  maxParticipants: number
  joinToken: string
  joinLocked: boolean
  vipOkay: boolean
}
