export interface Conference {
  conferenceId: string
  streamGuid: string
}

export interface ConferenceData {
  conferenceId: number
  displayName: string
  location: string
  joinLocked: boolean
  vipOkay: boolean
}
