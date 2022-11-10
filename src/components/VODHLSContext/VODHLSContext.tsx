import React, { useReducer } from 'react'
import { useRecoilState } from 'recoil'
import { useLocation, useSearchParams } from 'react-router-dom'
import { VODHLSItem } from '../../models/VODHLSItem'
import { VOD_CONTEXT, VOD_HOST, VOD_SOCKET_HOST } from '../../settings/variables'
import vodPlaybackState from '../../atoms/vod/vod'

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
    case 'SET_USER':
      return { ...state, userid: action.userid, name: action.name }
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
  setSelectedItem(value: VODHLSItem, userDriven?: boolean): any
  setIsPlaying(value: boolean, userDriven?: boolean): any
  // SeekTime is user driven for listening participants.
  // We don't rely on setting currentTime as that will be dispatched every millisecond
  // And cause choppy playback.
  setDrivenSeekTime(value: number, useDrive?: boolean): any
}

const VODHLSContext = React.createContext<IVODHLSContextProps>({} as IVODHLSContextProps)

const VODHLSProvider = (props: VODHLSContextProps) => {
  const { children } = props

  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const socketRef = React.useRef()
  const [vodSocket, setVODSocket] = React.useState<any>()

  const [vodState, setVODState] = useRecoilState(vodPlaybackState)
  const [user, setUser] = React.useState<any>()

  const [error, setError] = React.useState<any>()

  const [vod, dispatch] = useReducer(vodReducer, {
    // Use to send out messages to other participants.
    id: 0,
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
      setVODState({ ...vodState, ...{ active: yayornay } })
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
      setVODState({
        ...vodState,
        ...{
          active: true,
          list,
          selection: list.length > 0 ? list[0] : undefined,
        },
      })
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
        const newSelection = json.selectedItem || (vodState.list.length > 0 ? vodState.list[0] : undefined)
        const newState = {
          ...vodState,
          isPlaying: json.isPlaying,
          selection: newSelection,
          seekTime: json.currentTime,
          driver: json.currentDriver && json.currentDriver.userid === userid ? undefined : json.currentDriver,
          updateTs: new Date().getTime(),
        }
        // console.log('[help]::NEW STATE', newState)
        setVODState(newState)
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
    setUser({ userid: userid, name: nickname })
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

  const setDrivenSeekTime = (value: number, userDriven: boolean) => {
    // TODO: debounce this?...
    if (!userDriven) {
      dispatch({ type: 'SET_SEEK_TIME', time: value })
    } else if (socketRef && socketRef.current) {
      console.log('[socket] SET_SEEK_TIME', value)
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.TIME,
          value,
          from: user.userid,
        })
      )
    }
  }

  const setEnabled = (value: boolean) => {
    setVODState({ ...vodState, ...{ enabled: value } })
  }

  const setSelectedItem = (value: VODHLSItem, userDriven = false) => {
    // if (!userDriven) {
    setVODState({ ...vodState, ...{ selection: value } })
    // } else
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_SELECTION')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.SELECT,
          value,
          from: user.userid,
        })
      )
    }
  }

  const setIsPlaying = (value: boolean, userDriven = false) => {
    // if (!userDriven) {
    setVODState({ ...vodState, ...{ isPlaying: value } })
    // } else
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_PLAYING')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.PLAY,
          value,
          from: user.userid,
        })
      )
    }
  }

  const assumeDriverControl = () => {
    if (socketRef && socketRef.current) {
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.CONTROL,
          value: user,
          from: user.userid,
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
          from: user.userid,
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
