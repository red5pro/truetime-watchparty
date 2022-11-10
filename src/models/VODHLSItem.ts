export class VODHLSItem {
  public name: string
  public filename: string
  public url: string | undefined

  constructor(name: string, filename: string, url?: string) {
    this.name = name
    this.filename = filename
    this.url = url
  }
}

const VODPlaybackStateKeys = {
  ACTIVE: 'active',
  ENABLED: 'enabled',
  PLAYING: 'playing',
  SELECTION: 'selection',
  SEEK: 'seek',
  DRIVER: 'drive',
}

export { VODPlaybackStateKeys }
