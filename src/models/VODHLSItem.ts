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
