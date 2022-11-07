import { DriveEtaRounded } from '@mui/icons-material'
import React, { useReducer } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { VODHLSItem } from '../../models/VODHLSItem'
import { VOD_CONTEXT, VOD_HOST } from '../../settings/variables'

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
    case 'SET_DRIVER':
      return { ...state, driver: action.driver, name: action.name }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time }
    case 'SET_SEEK_TIME':
      return { ...state, seekTime: action.time }
    case 'SET_SELECTION':
      return { ...state, selectedItem: action.item }
  }
}

interface VODHLSContextProps {
  children: any
}

interface IVODHLSContextProps {
  vod: any
  setEnabled(value: boolean): any
  setUserDriver(value: any, name: string): any
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

  const [vod, dispatch] = useReducer(vodReducer, {
    active: false,
    enabled: false,
    isPlaying: false,
    list: [VODHLSItem],
    currentTime: 0,
    selectedItem: undefined,
    // Invoke from drive for currentTime on other participants.
    seekTime: 0,
    // Use to send out messages to other participants.
    driver: undefined,
    name: undefined,
  })

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

  const setDrivenSeekTime = (value: number) => {
    // TODO: debounce this?...
    dispatch({ type: 'SET_SEEK_TIME', time: value })
  }

  const setEnabled = (value: boolean) => {
    dispatch({ type: 'SET_ENABLED', enabled: value })
  }

  const setCurrentTime = (value: number, userDriven = false) => {
    dispatch({ type: 'SET_CURRENT_TIME', time: value })
    // TODO: debounce this...
    if (userDriven && vod.driver) {
      ;(vod.driver as any).send(INVOKE_EVENT_NAME, {
        key: InvokeKeys.TIME,
        value,
      })
    }
  }

  const setSelectedItem = (value: VODHLSItem, userDriven = false) => {
    dispatch({ type: 'SET_SELECTION', item: value })
    if (userDriven && vod.driver) {
      ;(vod.driver as any).send(INVOKE_EVENT_NAME, {
        key: InvokeKeys.SELECT,
        value: JSON.stringify(value),
      })
    }
  }

  const setIsPlaying = (value: boolean, userDriven = false) => {
    dispatch({ type: 'SET_PLAYING', isPlaying: value })
    if (userDriven && vod.driver) {
      ;(vod.driver as any).send(INVOKE_EVENT_NAME, {
        key: InvokeKeys.PLAY,
        value,
      })
    }
  }

  const setUserDriver = (value: any, name: string) => {
    dispatch({ type: 'SET_DRIVER', driver: value, name })
  }

  const assumeDriverControl = () => {
    if (vod.driver) {
      ;(vod.driver as any).send(INVOKE_EVENT_NAME, {
        key: InvokeKeys.CONTROL,
        name: vod.name,
      })
    }
  }

  const releaseDriverControl = () => {
    if (vod.driver) {
      ;(vod.driver as any).send(INVOKE_EVENT_NAME, {
        key: InvokeKeys.CONTROL,
        name: null,
      })
    }
  }

  const exportedValues = {
    vod,
    setEnabled,
    setCurrentTime,
    setSelectedItem,
    setIsPlaying,
    setDrivenSeekTime,
    setUserDriver,
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
