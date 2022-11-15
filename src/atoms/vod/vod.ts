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
    driver: driver, // driver is actively scrubbing with updates
    controller: driver, // controller drives updates across participants based on polling
    updateTs: 0,
  },
})
