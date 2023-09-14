/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { FatalError } from '../../models/FatalError'
import { Participant, ParticipantMuteState } from '../../models/Participant'

export interface IMainStageWrapperProps {
  loading: boolean
  requiresSubscriberScroll: boolean
  data: any
  layout: any
  subscriberListRef: any
  publisherRef: any
  mediaStream: MediaStream | undefined
  publishMuteState: ParticipantMuteState | undefined
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
  isAnonymous: boolean

  onLayoutSelect: (layout: number) => void
  getStreamGuid: () => string | null
  calculateGrid: (totalParticipants: number) => number
  calculateParticipantHeight: (totalParticipants: number) => string
  onAnonymousEntry: () => void
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
