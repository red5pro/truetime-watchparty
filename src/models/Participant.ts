export interface ParticipantMuteState {
  audioMuted: boolean | undefined
  videoMuted: boolean | undefined
  chatMuted: boolean | undefined
}

export interface Participant {
  participantId: number
  conferenceId: number
  displayName: string
  role: string
  streamGuid: string
  muteState?: ParticipantMuteState
}
