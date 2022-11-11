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
  RESPONSE = 'response',
}

interface VODHLSContextProps {
  children: any
}

interface IVODHLSContextProps {
  error: any
  join(token: string, nickname: string, userid: string): any
  leave(): any
  setEnabled(value: boolean): any
  assumeDriverControl(): any
  releaseDriverControl(): any
  setSelectedItem(value: VODHLSItem, atTime: number, userDriven?: boolean): any
  setIsPlaying(value: boolean, atTime: number, userDriven?: boolean): any
  // SeekTime is user driven for listening participants.
  // We don't rely on setting currentTime as that will be dispatched every millisecond
  // And cause choppy playback.
  setDrivenSeekTime(value: number, useDrive?: boolean): any
  setCurrentPlayHead(value: number): any
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
  const userRef = React.useRef(user)

  const [playhead, setPlayhead] = React.useState<number>()
  const playheadRef = React.useRef(playhead)

  const [interval, setInt] = React.useState<any | undefined>(undefined)

  const [error, setError] = React.useState<any>()

  React.useEffect(() => {
    if (vodSocket) {
      socketRef.current = vodSocket
      // if (!interval) {
      //   console.log('[help] SET INTERVAL')
      //   setInt(setInterval(sendPlayhead, 2000))
      // }
    }
    return () => {
      leave()
      // clearInterval(interval)
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
      const u = {
        name: nickname,
        userid,
      }
      setUser(u)
      userRef.current = u
    }
    socket.onmessage = (event) => {
      console.log('SOCKET MESSAGE', event)
      const { data } = event
      try {
        const json = JSON.parse(data)
        if (json.manifestUpdate) {
          const manifest = json.manifestUpdate
          const { isPlaying, currentTime } = manifest
          const newSelection = manifest.selectedItem || (vodState.list.length > 0 ? vodState.list[0] : undefined)
          const newState = {
            ...vodState,
            isPlaying: isPlaying,
            selection: newSelection,
            seekTime: currentTime,
            driver:
              manifest.currentDriver && manifest.currentDriver.userid === userid ? undefined : manifest.currentDriver,
            updateTs: new Date().getTime(),
          }
          // console.log('[help]::NEW STATE', newState)
          setVODState(newState)
        } else if (json.request) {
          const { request } = json
          if (request === 'sampleTime') {
            sendPlayhead()
          }
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
    const u = {
      name: nickname,
      userid,
    }
    setUser(u)
    userRef.current = u
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

  const sendPlayhead = () => {
    if (socketRef && socketRef.current) {
      const value = playheadRef.current ? playheadRef.current : 0
      if (value === 0) return
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.RESPONSE,
          request: 'sampleTime',
          response: value,
          from: userRef.current ? userRef.current.userid : user.userid,
        })
      )
    }
  }

  const setDrivenSeekTime = (value: number, userDriven: boolean) => {
    // TODO: debounce this?...
    if (!userDriven) {
      setVODState({ ...vodState, ...{ seekTime: value } })
    } else if (socketRef && socketRef.current) {
      console.log('[socket] SET_SEEK_TIME', value)
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.TIME,
          value,
          from: userRef.current ? userRef.current.userid : user.userid,
        })
      )
    }
  }

  const setCurrentPlayHead = (value: number) => {
    playheadRef.current = value
    setPlayhead(value)
    // if (socketRef && socketRef.current) {
    //   ;(socketRef.current as any).send(
    //     JSON.stringify({
    //       type: InvokeKeys.RESPONSE,
    //       request: 'sampleTime',
    //       response: vod.playheadTime,
    //       from: userRef.current ? userRef.current.userid : user.userid,
    //     })
    //   )
    // }
  }

  const setEnabled = (value: boolean) => {
    setVODState({ ...vodState, ...{ enabled: value } })
  }

  const setSelectedItem = (value: VODHLSItem, atTime: number, userDriven = false) => {
    // if (!userDriven) {
    setVODState({ ...vodState, ...{ selection: value } })
    // } else
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_SELECTION')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.SELECT,
          value,
          time: atTime,
          from: userRef.current ? userRef.current.userid : user.userid,
        })
      )
    }
  }

  const setIsPlaying = (value: boolean, atTime: number, userDriven = false) => {
    // if (!userDriven) {
    setVODState({ ...vodState, ...{ isPlaying: value } })
    // } else
    if (socketRef && socketRef.current) {
      console.log('[socket] SET_PLAYING')
      ;(socketRef.current as any).send(
        JSON.stringify({
          type: InvokeKeys.PLAY,
          value,
          time: atTime,
          from: userRef.current ? userRef.current.userid : user.userid,
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
          from: userRef.current ? userRef.current.userid : user.userid,
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
          from: userRef.current ? userRef.current.userid : user.userid,
        })
      )
    }
  }

  const exportedValues = {
    error,
    join,
    leave,
    setEnabled,
    setSelectedItem,
    setIsPlaying,
    setDrivenSeekTime,
    setCurrentPlayHead,
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
