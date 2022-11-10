import { atom } from 'recoil'
import { VODHLSItem } from './../../models/VODHLSItem'

const list: VODHLSItem[] = []
const selection: any | undefined = undefined
const driver: any | undefined = undefined

export default atom({
  key: 'vodPlaybackState',
  default: {
    list: list,
    active: false,
    enabled: false,
    isPlaying: false,
    seekTime: 0,
    selection: selection,
    driver: driver,
    updateTs: 0,
  },
})
