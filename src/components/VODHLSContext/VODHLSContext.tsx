import React, { useReducer } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { number } from 'yup/lib/locale'
import { VODHLSItem } from '../../models/VODHLSItem'
import { VOD_CONTEXT, VOD_HOST } from '../../settings/variables'

const vodReg = /^\/join\/vod/

const vodReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      return { ...state, active: action.active }
    case 'SET_LIST':
      return { ...state, list: action.list }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time }
    case 'SET_SELECTION':
      return { ...state, selectedItem: action.item }
  }
}

interface VODHLSContextProps {
  children: any
}

interface IVODHLSContextProps {
  vod: any
  setCurrentTime(value: number): any
  setSelectedItem(value: VODHLSItem): any
}

const VODHLSContext = React.createContext<IVODHLSContextProps>({} as IVODHLSContextProps)

const VODHLSProvider = (props: VODHLSContextProps) => {
  const { children } = props

  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [vod, dispatch] = useReducer(vodReducer, {
    active: false,
    list: [VODHLSItem],
    currentTime: 0,
    selectedItem: undefined,
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

  const setCurrentTime = (value: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', time: value })
  }

  const setSelectedItem = (value: VODHLSItem) => {
    dispatch({ type: 'SET_SELECTION', item: value })
  }

  const exportedValues = {
    vod,
    setCurrentTime,
    setSelectedItem,
  }

  return <VODHLSContext.Provider value={exportedValues}>{children}</VODHLSContext.Provider>
}

export default {
  Context: VODHLSContext,
  Consumer: VODHLSContext.Consumer,
  Provider: VODHLSProvider,
}
