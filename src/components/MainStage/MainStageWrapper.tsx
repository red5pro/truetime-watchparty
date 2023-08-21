import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import JoinContext from '../JoinContext/JoinContext'
import MediaContext from '../MediaContext/MediaContext'
import WatchContext from '../WatchContext/WatchContext'

import useCookies from '../../hooks/useCookies'
import { FatalError } from '../../models/FatalError'
import { ConnectionRequest } from '../../models/ConferenceStatusEvent'
import { API_SOCKET_HOST, isWatchParty } from '../../settings/variables'
import { PublisherRef } from '../Publisher'
import { Paths, UserRoles } from '../../utils/commonUtils'
import styles from './MainStageLayout'
import { Participant, ParticipantMuteState } from '../../models/Participant'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import WebinarMainStage from './WebinarMainStage'
import MainStage from './MainStage'
import { IMainStageWrapperProps } from '.'

export enum Layout {
  STAGE = 1,
  FULLSCREEN,
  EMPTY,
}

const layoutReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LAYOUT':
      return { ...state, layout: action.layout, style: action.style }
  }
}

const useJoinContext = () => React.useContext(JoinContext.Context)
const useWatchContext = () => React.useContext(WatchContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

const MainStageWrapper = () => {
  const {
    joinToken,
    seriesEpisode,
    fingerprint,
    nickname,
    getStreamGuid,
    lock,
    unlock,
    isAnonymousParticipant,
    cohostsList,
  } = useJoinContext()
  const { mediaStream } = useMediaContext()
  const { error, loading, data, join, retry } = useWatchContext()

  const navigate = useNavigate()
  const { getCookies } = useCookies(['account'])

  const publisherRef = React.useRef<PublisherRef>(null)
  const subscriberListRef = React.useRef<any>(null)

  const [viewportHeight, setViewportHeight] = React.useState<number>(0)
  const [fatalError, setFatalError] = React.useState<FatalError | undefined>()
  const [nonFatalError, setNonFatalError] = React.useState<any>()
  const [maxParticipants, setMaxParticipants] = React.useState<number>(8)
  const [publishMediaStream, setPublishMediaStream] = React.useState<MediaStream | undefined>()
  const [publishMuteState, setPublishMutestate] = React.useState<ParticipantMuteState | undefined>()
  const [userRole, setUserRole] = React.useState<string>(UserRoles.PARTICIPANT.toLowerCase())
  const [subscriberMenuActions, setSubscriberMenuActions] = React.useState<any>()
  const [layout, dispatch] = React.useReducer(layoutReducer, {
    layout: isWatchParty ? Layout.STAGE : Layout.FULLSCREEN,
    style: isWatchParty ? styles.stage : styles.fullscreen,
  })
  const [relayout, setRelayout] = React.useState<boolean>(false)
  const [showLink, setShowLink] = React.useState<boolean>(false)
  const [chatIsHidden, setChatIsHidden] = React.useState<boolean>(true)
  const [requiresSubscriberScroll, setRequiresSubscriberScroll] = React.useState<boolean>(false)
  const [showBanConfirmation, setShowBanConfirmation] = React.useState<Participant | undefined>()
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()
  const [maxParticipantGridColumnStyle, setMaxParticipantGridColumnStyle] = React.useState<any>({
    gridTemplateColumns:
      'calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px)',
  })
  const [isAnonymous, setIsAnonymous] = React.useState<boolean>(false)
  const [conferenceId, setConferenceId] = React.useState<any | undefined>(undefined)

  React.useEffect(() => {
    setIsAnonymous(isAnonymousParticipant)
  }, [isAnonymousParticipant])

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setViewportHeight(window.innerHeight)
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    // Fatal Socket Error.
    if (error) {
      setFatalError({
        ...(error as any),
        title: 'Connection Error',
        closeLabel: 'RETRY',
        onClose: () => {
          setFatalError(undefined)
          window.location.reload()
        },
      } as FatalError)
    }
  }, [error])

  React.useEffect(() => {
    if (seriesEpisode && seriesEpisode.loaded) {
      const { maxParticipants } = seriesEpisode.series
      const { streamGuid } = seriesEpisode.episode
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
      setMaxParticipants(maxParticipants)
    }
  }, [seriesEpisode])

  React.useEffect(() => {
    const shutdown = async () => {
      if (publisherRef && publisherRef.current) {
        await publisherRef.current.shutdown()
      }
    }
    if (data.closed) {
      shutdown()
    }
    if (data.closed && !fatalError) {
      setFatalError({
        status: 404,
        title: 'Connection Disruption',
        statusText: `Your session was interrupted expectedly. You are no longer in the Watch Party.`,
        closeLabel: 'OK',
        onClose: onLeave,
      } as FatalError)
    }
  }, [data.closed])

  React.useEffect(() => {
    if (data.connection) {
      const { connection } = data

      if (connection && connection.role) {
        const { role } = connection
        setUserRole(role.toLowerCase())
        setSubscriberMenuActions(getMenuActionsFromRole(role.toLowerCase()))
      }
    }
  }, [data.connection])

  React.useEffect(() => {
    if (
      getCookies().account &&
      cohostsList?.length &&
      cohostsList?.includes((email: string) => email === getCookies().account.email)
    ) {
      setUserRole(UserRoles.COHOST.toLowerCase())
    }
  }, [cohostsList])

  React.useEffect(() => {
    if (isAnonymousParticipant) {
      return
    }
    if (!mediaStream) {
      navigate(`/join/${joinToken}`)
    } else if (!publishMediaStream || publishMediaStream.id !== mediaStream.id) {
      setPublishMediaStream(mediaStream)
    }
  }, [mediaStream])

  React.useEffect(() => {
    const { currentParticipantState } = data
    if (currentParticipantState) {
      console.log('CURRENT PARTICIPANT STATE OF USER', data.currentParticipantState)
      setPublishMutestate(currentParticipantState)
    }
  }, [data.currentParticipantState])

  React.useEffect(() => {
    if (maxParticipants > 0) {
      const half = Math.floor(maxParticipants / 2)
      const column = `fit-content(230px)`
      //      const column = `calc((100% / ${half}) - 12px)`
      const style = Array(half).fill(column).join(' ')

      setMaxParticipantGridColumnStyle({
        gridTemplateColumns: style,
      })
    }
  }, [maxParticipants])

  React.useEffect(() => {
    if (layout.layout === Layout.STAGE && viewportHeight > 0 && subscriberListRef.current) {
      let needsScroll = false
      try {
        const bounds = subscriberListRef.current?.getBoundingClientRect()
        const lastBounds = subscriberListRef.current?.lastChild?.getBoundingClientRect()
        if (bounds && lastBounds) {
          needsScroll = lastBounds.bottom > bounds.bottom
        }
      } catch (e) {
        // TODO
      }
      setRelayout(false)
      setRequiresSubscriberScroll(needsScroll)
    } else {
      setRequiresSubscriberScroll(false)
    }
  }, [data.list, layout, viewportHeight, relayout])

  React.useEffect(() => {
    if (data.conference) {
      setConferenceId(data.conference.conferenceId)
    }
  }, [data.conference])

  const getAnonymousSocketUrl = (token: string) => {
    const request: ConnectionRequest = {
      // displayName: 'anon',
      joinToken: token,
      // streamGuid: 'anon',
      fingerprint,
      isAnonymous: true,
      messageType: 'JoinConferenceRequest',
    } as ConnectionRequest
    return { url: API_SOCKET_HOST, request }
  }

  const getSocketUrl = (token: string, name: string, guid: string) => {
    const request: ConnectionRequest = {
      displayName: name,
      joinToken: token,
      streamGuid: guid,
      fingerprint,
      messageType: 'JoinConferenceRequest',
    } as ConnectionRequest

    const cookies = getCookies()
    if (cookies?.account) {
      // Registered User
      if (cookies.account.token) {
        const { auth, token } = cookies.account
        request.auth = auth
        request.accessToken = token
      } else {
        const { email, password } = cookies.account
        request.username = email
        request.password = password
      }
    }

    return { url: API_SOCKET_HOST, request }
  }

  const getMenuActionsFromRole = (role: string) => {
    if (role === UserRoles.COHOST.toLocaleLowerCase()) {
      const cohostMenuActions = {
        onMuteAudio: organizerSubscriberMenuActions.onMuteAudio,
        onMuteVideo: organizerSubscriberMenuActions.onMuteVideo,
      }
      return cohostMenuActions
    }

    const allowed = [UserRoles.ADMIN, UserRoles.ORGANIZER].map((r) => r.toLowerCase())
    return allowed.indexOf(role) > -1 ? organizerSubscriberMenuActions : undefined
  }

  const onLeave = () => {
    if (isAnonymous) {
      navigate(`${Paths.ANONYMOUS_THANKYOU}/${joinToken}`)
      return
    }
    navigate(`/thankyou/${joinToken}`)
  }

  const onAnonymousEntry = () => {
    const { url, request } = getAnonymousSocketUrl(joinToken)
    join(url, request)
  }

  const onPublisherBroadcast = () => {
    const streamGuid = getStreamGuid()
    const { url, request } = getSocketUrl(joinToken, nickname, streamGuid)
    join(url, request)
  }

  const onPublisherBroadcastInterrupt = () => {
    setFatalError({
      status: 400,
      title: 'Broadcast Stream Error',
      statusText: `Your broadcast session was interrupted unexpectedly. You are no longer streaming.`,
      closeLabel: 'Restart',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  const onPublisherFail = () => {
    setFatalError({
      status: 404,
      title: 'Broadcast Stream Error',
      statusText: `Could not start a broadcast.`,
      closeLabel: 'Retry',
      onClose: () => {
        setFatalError(undefined)
        window.location.reload()
      },
    } as FatalError)
  }

  const toggleLock = async () => {
    const confId = conferenceId ?? data.conference.conferenceId
    if (!seriesEpisode.locked) {
      try {
        const result = await lock(confId)
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in locking party.' })
      }
    } else {
      try {
        const result = await unlock(confId)
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in unlocking party.' })
      }
    }
  }

  const toggleLink = () => {
    setShowLink(!showLink)
  }

  const toggleChat = () => {
    setChatIsHidden(!chatIsHidden)
  }

  const onPublisherCameraToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current && publisherRef.current.toggleCamera) {
      publisherRef.current.toggleCamera(isOn)
    }
  }

  const onPublisherMicrophoneToggle = (isOn: boolean) => {
    if (publisherRef && publisherRef.current && publisherRef.current.toggleMicrophone) {
      publisherRef.current.toggleMicrophone(isOn)
    }
  }

  const onMoreScroll = () => {
    if (subscriberListRef && subscriberListRef.current) {
      subscriberListRef.current.lastChild.scrollIntoView(false)
    }
  }

  const onRelayout = () => {
    setRelayout(true)
  }

  const onLayoutSelect = (layout: number) => {
    const newStyle =
      layout === Layout.FULLSCREEN ? styles.fullscreen : layout === Layout.EMPTY ? styles.empty : styles.stage
    dispatch({ type: 'LAYOUT', layout: layout, style: newStyle })
  }

  const organizerSubscriberMenuActions = {
    onMuteAudio: async (participant: Participant, requestMute: boolean) => {
      const { muteState } = participant
      const requestState = { ...muteState!, audioMuted: requestMute }
      const confId = conferenceId ?? data.conference?.conferenceId
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          confId,
          getCookies().account,
          participant.participantId,
          requestState
        )
        if (result.status >= 300) {
          throw result
        }
      } catch (e) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in muting participant.' })
      }
    },
    onMuteVideo: async (participant: Participant, requestMute: boolean) => {
      const { muteState } = participant
      const requestState = { ...muteState!, videoMuted: requestMute }
      const confId = conferenceId ?? data.conference?.conferenceId
      try {
        const result = await CONFERENCE_API_CALLS.muteParticipant(
          confId,
          getCookies().account,
          participant.participantId,
          requestState
        )
        if (result.status >= 300) {
          throw result
        }
      } catch (e: any) {
        console.error(e)
        setNonFatalError({ ...(e as any), title: 'Error in muting participant.' })
      }
    },
    onBan: (participant: Participant) => {
      setShowBanConfirmation(participant)
    },
  }

  const onContinueBan = async (participant: Participant) => {
    try {
      const confId = conferenceId ?? data.conference?.conferenceId
      const result = await CONFERENCE_API_CALLS.banParticipant(confId, getCookies().account, participant.participantId)
      if (result.status >= 300) {
        throw result
      }
    } catch (e) {
      console.error(e)
      setNonFatalError(e)
    } finally {
      setShowBanConfirmation(undefined)
    }
  }

  const calculateParticipantHeight = (totalParticipants: number) => {
    if (totalParticipants > 2) {
      const total = totalParticipants > 4 ? 4 : totalParticipants
      return `calc(100% - ${total * 4}rem)`
    }

    return '100%'
  }

  const calculateGrid = (totalParticipants: number) => {
    if (totalParticipants < 5) {
      return 12 / totalParticipants
    } else if (totalParticipants >= 7) {
      return 2.5
    }
    return 3
  }

  const mainStageProps: IMainStageWrapperProps = {
    data,
    loading,
    layout,
    getStreamGuid,
    subscriberListRef,
    publisherRef,
    mediaStream,
    publishMuteState,
    userRole,
    subscriberMenuActions,
    requiresSubscriberScroll,
    joinToken,
    showLink,
    seriesEpisode,
    publishMediaStream,
    chatIsHidden,
    fatalError,
    nonFatalError,
    showBanConfirmation,
    isAnonymous,

    onLayoutSelect,
    calculateGrid,
    calculateParticipantHeight,
    onAnonymousEntry,
    onPublisherFail,
    onPublisherBroadcast,
    onPublisherBroadcastInterrupt,
    onRelayout,
    onMoreScroll,
    setShowLink,
    toggleLink,
    toggleLock,
    onPublisherCameraToggle,
    onPublisherMicrophoneToggle,
    toggleChat,
    onContinueBan,
    setShowBanConfirmation,
    setNonFatalError,
    onLeave,
  }

  if (isWatchParty) {
    return (
      <MainStage
        {...mainStageProps}
        mainStreamGuid={mainStreamGuid}
        setPublishMediaStream={setPublishMediaStream}
        maxParticipantGridColumnStyle={maxParticipantGridColumnStyle}
      />
    )
  }

  return <WebinarMainStage {...mainStageProps} />
}

export default MainStageWrapper
