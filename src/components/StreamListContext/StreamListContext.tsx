import React from 'react'
import { STREAM_HOST, USE_CLOUD_STORAGE } from '../../settings/variables'
import { getLiveListing, getVODMediafiles, getVODPlaylists } from '../../utils/streamManagerUtils'
import { isWatchParty } from '../../settings/variables'
import { WebbAppMode } from '../../utils/variableUtils'
import { Stream, StreamFormatType, VODStream } from '../../models/Stream'

// NOTE: Ruling that Mixer Streams have the nomenclature of <space-delimited-camel-cap>_WEBINAR
//        Noting this nomenclature, the following util methods can derive the filename and title.

const camelCaseReg = /([a-z0-9])([A-Z])/g
const streamNameReg = new RegExp(`(.*)_${!isWatchParty ? WebbAppMode.WEBINAR : WebbAppMode.WATCHPARTY}`, 'i')

const camelCaseTitle = (title: string) => title.replace(camelCaseReg, '$1 $2')

const getFilenameFromName = (name: string) => {
  const slash = name.lastIndexOf('/')
  const file = name.substring(slash, name.length)
  const dot = file.lastIndexOf('.')
  return file.substring(0, dot)
}
const getTitleFromFilename = (name: string) => {
  const match = streamNameReg.exec(name.toLowerCase())
  if (match && match.length > 1) {
    const prepend = match[1]
    return camelCaseTitle(prepend)
  }
  return name
}

const eventReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'RESET_ALL':
      return {
        ...state,
        liveLoading: true,
        liveLoaded: false,
        liveError: undefined,
        vodLoading: true,
        vodLoaded: false,
        vodError: undefined,
      }
    case 'RESET_LIVE':
      return {
        ...state,
        liveLoading: true,
        liveLoaded: false,
        liveError: undefined,
        // keep previously stored state of stream list...
      }
    case 'RESET_VOD':
      return {
        ...state,
        vodLoading: true,
        vodLoaded: false,
        vodError: undefined,
        // keep previously stored state of stream list...
      }
    case 'UPDATE_LIVE':
      return {
        ...state,
        liveLoading: false,
        liveLoaded: true,
        liveError: action.error,
        liveStreams: action.streams,
      }
    case 'UPDATE_VOD':
      return {
        ...state,
        vodLoading: false,
        vodLoaded: true,
        vodError: action.error,
        vodStreams: action.streams,
      }
  }
}

interface StreamListContextProps {
  children: any
}

const StreamListContext = React.createContext<any>(null)

const StreamListProvider = (props: StreamListContextProps) => {
  const { children } = props

  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(false)

  const [data, dispatch] = React.useReducer(eventReducer, {
    liveError: undefined,
    vodError: undefined,
    liveLoading: true,
    vodLoading: true,
    liveLoaded: false,
    vodLoaded: false,
    liveStreams: [], // model/Stream
    vodStreams: [], // model/VODStream
  })

  React.useEffect(() => {
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (!loaded && ready) {
      load()
    }
  }, [ready])

  const loadLive = async () => {
    try {
      const response = await getLiveListing(STREAM_HOST)
      const webinars = response
        .filter((s: Stream) => streamNameReg.exec(s.name.toLowerCase()))
        .map((s: Stream) => {
          s.title = getTitleFromFilename(s.name)
          return s
        })
      dispatch({ type: 'UPDATE_LIVE', streams: webinars })
      return webinars
    } catch (e: any) {
      console.error(e)
      dispatch({ type: 'UPDATE_LIVE', error: typeof e === 'string' ? e : e.message, streams: [] })
      return []
    }
  }

  const loadVOD = async (liveStreams: [Stream]) => {
    let error: any = undefined
    let streams: VODStream[] = []
    try {
      // TODO: Change to true once we know mixer is sending to cloud...
      const response = await getVODMediafiles(STREAM_HOST, 'live', USE_CLOUD_STORAGE)
      const webinars = response.filter((s: VODStream) => streamNameReg.exec(s.name.toLowerCase()))
      const mp4s = webinars.map((s: VODStream) => {
        s.type = StreamFormatType.MP4
        return s
      })
      streams = streams.concat(mp4s)
    } catch (e: any) {
      console.error(e)
      error = typeof e === 'string' ? e : e.message
    }
    try {
      // TODO: Change to true once we know mixer is sending to cloud...
      const response = await getVODPlaylists(STREAM_HOST, 'live', USE_CLOUD_STORAGE)
      const webinars = response.filter((s: VODStream) => streamNameReg.exec(s.name.toLowerCase()))
      const hls = webinars.map((s: VODStream) => {
        // Prefer MP4 over HLS if doubled
        const exists = streams.findIndex((vod: VODStream) => vod.filename === s.filename)
        if (exists > -1) {
          return undefined
        }
        s.type = StreamFormatType.HLS
        return s
      })
      streams = streams.concat(hls.filter((s: VODStream) => s))
      // Decorate.
      streams = streams.map((s: VODStream) => {
        const filename = getFilenameFromName(s.name)
        s.filename = filename
        s.title = getTitleFromFilename(filename)
        return s
      })
      streams.sort((a: VODStream, b: VODStream) => a.lastModified - b.lastModified)
    } catch (e: any) {
      console.error(e)
      error = typeof e === 'string' ? e : e.message
    }

    // Strip all that are also considered "live".
    // The API returns playlists/mediafiles for both VOD and live streams.
    streams = streams.filter((vod: VODStream) => {
      return liveStreams.findIndex((s: Stream) => vod.filename === s.name) === -1
    })
    dispatch({ type: 'UPDATE_VOD', error, streams })
  }

  const load = async () => {
    setLoaded(false)
    let liveStreams = []
    // data state errors handled in specific load calls.
    try {
      liveStreams = await loadLive()
    } catch (e: any) {
      console.error(e)
    }
    try {
      await loadVOD(liveStreams)
    } catch (e: any) {
      console.error(e)
    }
    setLoaded(true)
  }

  const reload = async () => {
    dispatch({ type: 'RESET_ALL' })
    load()
  }

  const exportedValues = {
    data,
    loaded,
    reload,
  }

  return <StreamListContext.Provider value={exportedValues}>{children}</StreamListContext.Provider>
}

export default {
  Context: StreamListContext,
  Consumer: StreamListContext.Consumer,
  Provider: StreamListProvider,
}
