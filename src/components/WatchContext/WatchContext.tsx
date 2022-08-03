import * as React from 'react'
import { SubscriberEventTypes, RTCSubscriberEventTypes } from 'red5pro-webrtc-sdk'
import { SERVER_HOST } from '../../settings/variables'
import { removeFromArray } from '../../utils/commonUtils'
import { getServerSettings } from '../../utils/publishUtils'

interface IWatchProviderProps {
  children: any
}

interface IBitrateTicket {
  connection?: any
  resolutionCb?: any
  isSubscriber: boolean
  bitrateInterval: number
  audioOnly: boolean
}

const vRegex = /VideoStream/
const aRegex = /AudioStream/

const WatchContext = React.createContext<any>(null)

const WatchProvider = (props: IWatchProviderProps) => {
  const { children } = props

  const [streamsList, setStreamsList] = React.useState<string[]>([])
  const [hostSocket, setHostSocket] = React.useState<any>()
  const [bitrateInterval, setBitrateInterval] = React.useState<any>()
  const [packetsSentComplete, setPacketsSentComplete] = React.useState<boolean>(false)
  const [bitrateTickets, setBitrateTickets] = React.useState<any>()
  const [globalBitrateTicket, setGlobalBitrateTicket] = React.useState<any>()
  const [bitrateTicket, setBitrateTicket] = React.useState<IBitrateTicket>({
    isSubscriber: false,
    bitrateInterval: 0,
    audioOnly: false,
  })
  const [statusField, setStatusField] = React.useState<string>('')
  const [inFailedState, setInFailedState] = React.useState<boolean>(false)
  const [subscriberMap, setSubscribersMap] = React.useState<any>([])
  const [mainVideoConnected, setMainVideoConnected] = React.useState<boolean>(false)
  const [streamConnected, setStreamConnected] = React.useState<string[]>([])

  //---- START: Methods to identify if the participant has already connect to a stream ----
  const addStreamConnected = (value: string) => {
    const streamList = [...streamConnected, value]
    setStreamConnected(streamList)
  }

  const removeStreamConnected = (value: string) => {
    const streamList = streamConnected.filter((x: string) => x !== value)
    setStreamConnected(streamList)
  }

  //---- END:  Methods to identify if the participant has already connect to a stream ----

  const bitrateStart = async (
    ticket: any,
    connection: any,
    resolutionCb: any,
    isSubscriber: boolean,
    roomName: string,
    streamName: string
  ) => {
    establishSocketHost(roomName, streamName)
    let lastResult: any
    const bitrateInterval = setInterval(async () => {
      const stats = await connection.getStats(null)

      stats.forEach((report: any) => {
        let bytes
        let packets
        const now = report.timestamp
        let bitrate
        if (
          !isSubscriber &&
          (report.type === 'outboundrtp' ||
            report.type === 'outbound-rtp' ||
            (report.type === 'ssrc' && report.bytesSent))
        ) {
          bytes = report.bytesSent
          packets = report.packetsSent
          if (report.mediaType === 'video' || report.id.match(vRegex)) {
            if (lastResult && lastResult.get(report.id)) {
              // calculate bitrate
              bitrate =
                (8 * (bytes - lastResult.get(report.id).bytesSent)) / (now - lastResult.get(report.id).timestamp)
              onBitrateUpdate(bitrate, packets)
            }
          }
        }
        // playback.
        else if (
          isSubscriber &&
          (report.type === 'inboundrtp' ||
            report.type === 'inbound-rtp' ||
            (report.type === 'ssrc' && report.bytesReceived))
        ) {
          bytes = report.bytesReceived
          packets = report.packetsReceived
          if (ticket.audioOnly && (report.mediaType === 'audio' || report.id.match(aRegex))) {
            if (lastResult && lastResult.get(report.id)) {
              // calculate bitrate
              bitrate =
                (8 * (bytes - lastResult.get(report.id).bytesReceived)) / (now - lastResult.get(report.id).timestamp)
              onBitrateUpdate(bitrate, packets)
            }
          } else if (!ticket.audioOnly && (report.mediaType === 'video' || report.id.match(vRegex))) {
            if (lastResult && lastResult.get(report.id)) {
              // calculate bitrate
              bitrate =
                (8 * (bytes - lastResult.get(report.id).bytesReceived)) / (now - lastResult.get(report.id).timestamp)
              onBitrateUpdate(bitrate, packets)
            }
          }
        } else if (resolutionCb && report.type === 'track') {
          let fw = 0
          let fh = 0
          if (report.kind === 'video' || report.frameWidth || report.frameHeight) {
            fw = report.frameWidth
            fh = report.frameHeight
            if (fw > 0 || fh > 0) {
              resolutionCb(fw, fh)
            }
          }
        }
      })
      lastResult = stats
    }, 1000)
    setBitrateInterval(bitrateInterval)
  }

  const stopBitrate = (bitrateInterval: any) => clearInterval(bitrateInterval)

  const trackBitrate = (
    connection: any,
    resolutionCb: any,
    isSubscriber: boolean,
    withTicket: any,
    roomName: string,
    streamName: string
  ) => {
    const t = { connection, resolutionCb, isSubscriber }

    if (withTicket) {
      const ticket = ['bitrateTicket', Math.floor(Math.random() * 0x10000).toString(16)].join('-')
      setBitrateTickets([t])
      bitrateStart(t, connection, resolutionCb, isSubscriber, roomName, streamName)
      return ticket
    } else if (globalBitrateTicket) {
      stopBitrate(globalBitrateTicket)
    }
    setGlobalBitrateTicket(t)
    bitrateStart(t, connection, resolutionCb, isSubscriber, roomName, streamName)
    return globalBitrateTicket
  }

  const untrackBitrate = (ticket?: any) => {
    if (!ticket && globalBitrateTicket) {
      stopBitrate(globalBitrateTicket)
    } else if (bitrateTickets[ticket]) {
      stopBitrate(ticket)

      const bitrateTicketsUpdated = bitrateTickets[ticket]
      delete bitrateTicketsUpdated[ticket]

      setBitrateTickets(bitrateTickets)
    }
  }

  // function updateStatistics(b, p, w, h) {
  //   //statisticsField.classList.remove('hidden');
  //   bitrateField.innerText = b === 0 ? "N/A" : Math.floor(b);
  //   packetsField.innerText = p;
  //   resolutionField.innerText = (w || 0) + "x" + (h || 0);
  // }

  const onBitrateUpdate = (bitrate: any, packetsSent: any) => {
    // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
    if (packetsSent > 100 && !packetsSentComplete) {
      setPacketsSentComplete(true)
      // clearTimeout(packetsOutTimeout);
      // enableMuteOptions()
    }
  }

  const positionExisting = (list: string[] = []) => {
    list.forEach((name, index) => {
      // const elementContainer = document.getElementById(
      //   window.getConferenceSubscriberElementContainerId(name),
      // );
      // if (elementContainer && index < bottomRowLimit) {
      //   if (
      //     elementContainer.parentNode &&
      //     elementContainer.parentNode !== bottomSubscribersEl
      //   ) {
      //     elementContainer.parentNode.removeChild(elementContainer);
      //     bottomSubscribersEl.appendChild(elementContainer);
      //   }
      // } else if (elementContainer) {
      //   if (
      //     elementContainer.parentNode &&
      //     elementContainer.parentNode !== sideSubscribersEl
      //   ) {
      //     elementContainer.parentNode.removeChild(elementContainer);
      //     sideSubscribersEl.appendChild(elementContainer);
      //   }
      // }
    })
  }

  const getSocketLocationFromProtocol = () => {
    const settings = getServerSettings()
    const isSecure = window.location.protocol.includes('https')

    return !isSecure
      ? { protocol: 'ws', port: settings?.wsport ?? '' }
      : { protocol: 'wss', port: settings?.wssport ?? '' }
  }

  const processStreams = (list: string[], roomName: string, exclusion: string) => {
    const nonPublishers = list.filter((name: string) => {
      return name !== exclusion
    })

    if (nonPublishers.length) {
      const existing: string[] = []
      const toAdd: string[] = []
      const toRemove: string[] = []

      nonPublishers.filter((name: string) => {
        streamsList.indexOf(name) !== -1 && existing.indexOf(name) === -1 && existing.push(name)
        streamsList.indexOf(name) === -1 && toAdd.indexOf(name) === -1 && toAdd.push(name)
        list.indexOf(name) === -1 && toRemove.indexOf(name) === -1 && toRemove.push(name)
      })

      const subscribers = [...existing, ...toAdd]

      removeSubscribers(toRemove)
      setStreamsList(subscribers)
      positionExisting(existing)
    }
  }

  const establishSocketHost = (roomName: string, streamName: string, isPublisher = true) => {
    if (hostSocket) return

    const isSecure = window.location.protocol.includes('https') || window.location.hostname.includes('localhost')
    const wsProtocol = isSecure ? 'wss' : 'ws'

    // hacked to support remote server while doing local development
    const url = `${wsProtocol}://${SERVER_HOST}:8443?room=${roomName}&streamName=${streamName}`
    const newHostSocket = new WebSocket(url)

    newHostSocket.onmessage = (ev: any) => {
      const payload = JSON.parse(ev.data)
      if (roomName === payload.room && isPublisher) {
        processStreams(payload.streams, roomName, streamName)
      }
    }

    newHostSocket.onopen = (ev: Event) => {
      setHostSocket(ev.currentTarget)
    }
  }

  const addSubscriber = (name: string) => {
    const list = [...streamsList, name]
    setStreamsList(list)

    return list
  }

  const removeSubscribers = (items: string[]) => {
    const updatedList = removeFromArray(streamsList, items)

    setStreamsList(updatedList)

    return updatedList
  }

  const addSubscriberMap = (subscriber: any) => {
    const list = [...subscriberMap, subscriber]
    setSubscribersMap(list)

    return list
  }

  const updateSuscriberStatusFromEvent = (event: any) => {
    const wasInFailedState = inFailedState
    let currentInFailedState = inFailedState

    let status = ''
    let answer
    let candidate
    if (event.type === SubscriberEventTypes.SUBSCRIBE_METADATA) {
      return false
    }
    switch (event.type) {
      case 'ERROR':
        currentInFailedState = true
        setStatusField(['ERROR', event.data].join(': '))
        break
      case SubscriberEventTypes.CONNECTION_CLOSED:
        status = 'Connection closed.'
        untrackBitrate()

        break
      case SubscriberEventTypes.CONNECT_SUCCESS:
        status = 'Connection established...'

        break
      case SubscriberEventTypes.CONNECT_FAILURE:
        status = 'Error - Could not establish connection.'
        currentInFailedState = true
        break
      case SubscriberEventTypes.SUBSCRIBE_START:
        status = 'Started subscribing session.'

        break
      case SubscriberEventTypes.SUBSCRIBE_FAIL:
        status = 'Error - Could not start a subscribing session.'
        currentInFailedState = true
        break
      case SubscriberEventTypes.SUBSCRIBE_INVALID_NAME:
        status = 'Error - Stream name not in use.'
        currentInFailedState = true
        break
      case RTCSubscriberEventTypes.OFFER_START:
        status = 'Begin offer...'
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.OFFER_END:
        status = 'Offer accepted...'
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.ANSWER_START:
        status = 'Sending answer...'
        answer = JSON.stringify(event.data, null, 2)
        console.log('[SubscriberStatus] ' + event.type + ': ' + answer)
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.ANSWER_END:
        status = 'Answer received...'
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.CANDIDATE_START:
        status = 'Sending candidate...'
        candidate = JSON.stringify(event.data, null, 2)
        console.log('[SubscriberStatus] ' + event.type + ': ' + candidate)
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.CANDIDATE_END:
        status = 'Candidate received...'
        currentInFailedState = false
        break
      case RTCSubscriberEventTypes.ICE_TRICKLE_COMPLETE:
        status = 'Negotiation complete. Waiting Subscription Start...'
        currentInFailedState = false
        break
      default:
        currentInFailedState = false
        break
    }
    setInFailedState(currentInFailedState)
    if (wasInFailedState && currentInFailedState) {
      return true
    }
    if (status && status.length > 0) {
      setStatusField(['STATUS', status].join(': '))
    }
    return currentInFailedState
  }

  const exportedValues = {
    streamConnected,
    mainVideoConnected,
    streamsList,
    hostSocket,
    methods: {
      addSubscriber,
      removeSubscribers,
      setHostSocket,
      trackBitrate,
      untrackBitrate,
      establishSocketHost,
      updateSuscriberStatusFromEvent,
      getSocketLocationFromProtocol,
      addSubscriberMap,
      setMainVideoConnected,
      addStreamConnected,
      removeStreamConnected,
    },
  }

  return <WatchContext.Provider value={exportedValues}>{children}</WatchContext.Provider>
}

export default {
  Context: WatchContext,
  Consumer: WatchContext.Consumer,
  Provider: WatchProvider,
}
