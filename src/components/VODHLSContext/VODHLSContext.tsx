import { join } from 'lodash'
import React, { useReducer } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { VODHLSItem } from '../../models/VODHLSItem'
import { VOD_CONTEXT, VOD_HOST, VOD_SOCKET_HOST } from '../../settings/variables'

const vodReg = /^\/join\/vod/
const INVOKE_EVENT_NAME = 'VOD_SYNC'
enum InvokeKeys {
  PLAY = 'play',
  TIME = 'time',
  SELECT = 'select',
  CONTROL = 'control',
}

const vodReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      return { ...state, active: action.active }
    case 'SET_ENABLED':
      return { ...state, enabled: action.enabled }
    case 'SET_LIST':
      return { ...state, list: action.list }
    case 'SET_USER':
      return { ...state, userid: action.userid, name: action.name }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time }
    case 'SET_SEEK_TIME':
      return { ...state, seekTime: action.time }
    case 'SET_SELECTION':
      return { ...state, selectedItem: action.item }
    case 'SET_CURRENT_DRIVER':
      return { ...state, currentDriver: action.driver }
  }
}

interface VODHLSContextProps {
  children: any
}

interface IVODHLSContextProps {
  vod: any
  error: any
  join(token: string, nickname: string, userid: string): any
  leave(): any
  setEnabled(value: boolean): any
  assumeDriverControl(): any
  releaseDriverControl(): any
  setCurrentTime(value: number, userDriven?: boolean): any
  setSelectedItem(value: VODHLSItem, userDriven?: boolean): any
  setIsPlaying(value: boolean, userDriven?: boolean): any
  // SeekTime is user driven for listening participants.
  // We don't rely on setting currentTime as that will be dispatched every millisecond
  // And cause choppy playback.
  setDrivenSeekTime(value: number): any
}

const VODHLSContext = React.createContext<IVODHLSContextProps>({} as IVODHLSContextProps)

const VODHLSProvider = (props: VODHLSContextProps) => {
  const { children } = props

  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const socketRef = React.useRef()
  const [vodSocket, setVODSocket] = React.useState<any>()

  const [error, setError] = React.useState<any>()

  const [vod, dispatch] = useReducer(vodReducer, {
    active: false,
    enabled: false,
    isPlaying: false,
    list: [VODHLSItem],
    currentTime: 0,
    selectedItem: undefined,
    currentDriver: undefined,
    // Invoke from drive for currentTime on other participants.
    seekTime: 0,
    // Use to send out messages to other participants.
    name: undefined,
    userid: undefined,
  })

  React.useEffect(() => {
    socketRef.current = vodSocket
    return () => {
      leave()
    }
  }, [vodSocket])

  React.useEffect(() => {
    if (location) {
      const { pathname } = location
      const yayornay = !!pathname.match(vodReg)
      dispatch({ type: 'SET_ACTIVE', active: yayornay })
    }
  }, [location])

  React.useEffect(() => {
    if (searchParams) {
      let host = VOD_HOST
      let context = VOD_CONTEXT
      const list: VODHLSItem[] = []
      searchParams.forEach((value, key) => {
        if (key === 'host') {
          host = decodeURIComponent(value)
        } else if (key === 'context') {
          context = decodeURIComponent(value)
        } else {
          const item = new VODHLSItem(decodeURIComponent(key), `${decodeURIComponent(value)}.m3u8`)
          list.push(item)
        }
      })
      // TODO: Expand for cloudstorage over SM.
      list.forEach((item: VODHLSItem) => {
        const ctx = context.toLowerCase() === 'root' ? '' : `${context}/`
        item.url = `https://${host}/${ctx}${item.filename}`
      })
      dispatch({ type: 'SET_LIST', list: list })
      dispatch({ type: 'SET_SELECTION', item: list.length > 0 ? list[0] : undefined })
    }
  }, [searchParams])

  const join = (token: string, nickname: string, userid: string) => {
    const url = `${VOD_SOCKET_HOST}?token=${token}&userid=${userid}`
    const socket = new WebSocket(url)
    socket.onopen = () => {
      console.log('SOCKET OPEN')
      dispatch({ type: 'SET_USER', name: nickname, userid })
    }
    socket.onmessage = (event) => {
      console.log('SOCKET MESSAGE', event)
      const { data } = event
      try {
        const json = JSON.parse(data).manifestUpdate
        if (json.currentTime !== vod.currentTime) {
          dispatch({ type: 'SET_CURRENT_TIME', time: json.currentTime })
        }
        if (json.isPlaying !== vod.isPlaying) {
          dispatch({ type: 'SET_PLAYING', isPlaying: json.isPlaying })
        }
        if (json.selectedItem) {
          dispatch({ type: 'SET_SELECTION', item: json.selectedItem })
        } else if (vod && vod.list) {
          setSelectedItem(vod.list.length > 0 ? vod.list[0] : undefined)
        }
        if (json.currentDriver) {
          dispatch({ type: 'SET_CURRENT_DRIVER', driver: json.currentDriver })
        } else {
          dispatch({ type: 'SET_CURRENT_DRIVER', driver: undefined })
        }
      } catch (e) {
        console.error(e)
      }
    }
    socket.onerror = (event) => {
      const { type } = event
      if (type === 'error') {
        console.error('SOCKET ERROR', event)
      }
      setError(new Error('Socket closed unexpectedly.'))
    }
    socket.onclose = (event) => {
      const { wasClean, code } = event
      if (!wasClean || code !== 1000) {
        // Not Expected.
        setError(new Error('Socket closed unexpectedly.'))
      }
      console.log('SOCKET CLOSE', event)
    }
    setVODSocket(socket)
  }

  const leave = () => {
    if (socketRef.current) {
      try {
        ;(socketRef.current as WebSocket).close(1000)
      } catch (e) {
        console.error(e)
      }
      socketRef.current = undefined
      setVODSocket(undefined)
    }
  }

  const setDrivenSeekTime = (value: number) => {
    // TODO: debounce this?...
    dispatch({ type: 'SET_SEEK_TIME', time: value })
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_SEEK_TIME', value)
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.TIME,
          value,
          from: vod.userid,
        })
      )
    }
  }

  const setEnabled = (value: boolean) => {
    dispatch({ type: 'SET_ENABLED', enabled: value })
  }

  const setCurrentTime = (value: number, userDriven = false) => {
    dispatch({ type: 'SET_CURRENT_TIME', time: value })
    console.log('[socket] SET_CURRENT_TIME', value)
  }

  const setSelectedItem = (value: VODHLSItem, userDriven = false) => {
    dispatch({ type: 'SET_SELECTION', item: value })
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_SELECTION')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.SELECT,
          value,
          from: vod.userid,
        })
      )
    }
  }

  const setIsPlaying = (value: boolean, userDriven = false) => {
    dispatch({ type: 'SET_PLAYING', isPlaying: value })
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_PLAYING')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.PLAY,
          value,
          from: vod.userid,
        })
      )
    }
  }

  const assumeDriverControl = () => {
    if (socketRef && socketRef.current) {
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.CONTROL,
          value: vod.name,
          from: vod.userid,
        })
      )
    }
  }

  const releaseDriverControl = () => {
    if (socketRef && socketRef.current) {
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.CONTROL,
          value: undefined,
          from: vod.userid,
        })
      )
    }
  }

  const exportedValues = {
    vod,
    error,
    join,
    leave,
    setEnabled,
    setCurrentTime,
    setSelectedItem,
    setIsPlaying,
    setDrivenSeekTime,
    assumeDriverControl,
    releaseDriverControl,
  }

  return <VODHLSContext.Provider value={exportedValues}>{children}</VODHLSContext.Provider>
}

export default {
  Context: VODHLSContext,
  Consumer: VODHLSContext.Consumer,
  Provider: VODHLSProvider,
  SyncInvokeEventName: INVOKE_EVENT_NAME,
  SyncInvokeKeys: InvokeKeys,
}
