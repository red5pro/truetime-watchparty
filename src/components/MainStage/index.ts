import { FatalError } from '../../models/FatalError'
import { Participant } from '../../models/Participant'

export interface IMainStageWrapperProps {
  loading: boolean
  requiresSubscriberScroll: boolean
  data: any
  layout: any
  subscriberListRef: any
  publisherRef: any
  mediaStream: MediaStream | undefined
  userRole: string
  subscriberMenuActions: {
    onMuteAudio: (participant: Participant, requestMute: boolean) => Promise<void>
    onMuteVideo: (participant: Participant, requestMute: boolean) => Promise<void>
    onBan: (participant: Participant) => void
  }
  joinToken: string | null
  showLink: boolean
  chatIsHidden: boolean
  seriesEpisode: any
  publishMediaStream: MediaStream | undefined
  fatalError: FatalError | undefined
  nonFatalError: any
  showBanConfirmation: Participant | undefined
  isAnonymousParticipant: boolean

  onLayoutSelect: (layout: number) => void
  getStreamGuid: () => string | null
  calculateGrid: (totalParticipants: number) => number
  calculateParticipantHeight: (totalParticipants: number) => string
  onPublisherFail: () => void
  onPublisherBroadcastInterrupt: () => void
  onPublisherBroadcast: () => void
  onLeave: () => void
  onRelayout: () => void
  onMoreScroll: () => void
  setShowLink: (value: boolean) => void
  setNonFatalError: (value: boolean | undefined) => void
  toggleLink: () => void
  toggleLock: () => Promise<void>
  onPublisherCameraToggle: (isOn: boolean) => void
  onPublisherMicrophoneToggle: (isOn: boolean) => void
  toggleChat: () => void
  onContinueBan: (participant: Participant) => Promise<void>
  setShowBanConfirmation: (participant: Participant | undefined) => void
}
