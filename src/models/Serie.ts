import { Episode } from './Episode'

export interface Serie {
  seriesId: number
  displayName: string
  maxParticipants: number
  episodes: Episode[]
}
