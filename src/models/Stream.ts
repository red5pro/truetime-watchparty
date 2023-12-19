export interface Stream {
  title?: string
  type: string // origin or edge
  name: string
  scope: string
  serverAddress: string
  region: string
}

export interface VODStream {
  type?: StreamFormatType
  filename?: string
  title?: string
  fullUrl?: string
  name: string
  lastModified: number
  length: number
  url: string
}

export enum StreamFormatType {
  HLS = 0,
  MP4 = 1,
}
