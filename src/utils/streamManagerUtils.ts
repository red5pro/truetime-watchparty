import { Stream, VODStream } from './../models/Stream'

const urlReg = /^https/

/**
 * Request to get Origin data to broadcast on stream manager proxy.
 */
export const getOrigin = async (host: string, context: string, streamName: string, transcode = false) => {
  let url = `https://${host}/streammanager/api/4.0/event/${context}/${streamName}?action=broadcast`
  if (transcode) {
    url += '&transcode=true'
  }
  const result = await fetch(url)
  const json = await result.json()
  if (json.errorMessage) {
    throw new Error(json.errorMessage)
  }
  return json
}

/**
 * Request to get Edge on stream managaer to consume stream from stream manager proxy.
 */
export const getEdge = async (host: string, context: string, streamName: string) => {
  const url = `https://${host}/streammanager/api/4.0/event/${context}/${streamName}?action=subscribe`
  const result = await fetch(url)
  const json = await result.json()
  if (json.errorMessage) {
    throw new Error(json.errorMessage)
  }
  return json
}

/**
 * Requests all available live streams. => model/[Stream]
 */
export const getLiveListing = async (host: string) => {
  const url = `https://${host}/streammanager/api/4.0/event/list`
  const result = await fetch(url)
  const json = await result.json()
  if (json.errorMessage) {
    throw new Error(json.errorMessage)
  }
  return json.filter((s: Stream) => s.type === 'origin')
}

/**
 * Requests all available VOD files in MP4 and FLV format. => model/[VODStream]
 */
export const getVODMediafiles = async (host: string, context: string, useCloud = true) => {
  const mp4Reg = /.*\.mp4/
  const url = `https://${host}/streammanager/api/4.0/media/${context}/mediafiles?useCloud=${'' + useCloud}`
  const result = await fetch(url)
  const json = await result.json()
  if (json.errorMessage) {
    throw new Error(json.errorMessage)
  }
  // Only return MP4s
  const { mediafiles } = json
  // TODO: Hrm... how do we get an origin that may have VOD file if not in cloud storage?

  // const allUrls = Promise.allSettled(
  //   mediafiles.map(async (vod: VODStream) => {
  //     // If cloudstorage, this will already be provided in url attribute
  //     // If not, flesh it out as residing on an origin
  //     // vod.fullUrl = vod.url
  //     // if (urlReg.exec(s.url) === null) {
  //     //   try {
  //     //     const fullUrl = await getFullUrlFromFilename('live', s.url)
  //     //   } catch (e) {
  //     //     console.error(e)
  //     //     // nevermind
  //     //   }
  //     // }
  //     return vod.url
  //   })
  // )
  return mediafiles.filter((s: VODStream) => mp4Reg.exec(s.name))
}

/**
 * Requests all available VOD files in HLS format. => model/[VODStream]
 */
export const getVODPlaylists = async (host: string, context: string, useCloud = true) => {
  const url = `https://${host}/streammanager/api/4.0/media/${context}/playlists?useCloud=${'' + useCloud}`
  const result = await fetch(url)
  const json = await result.json()
  if (json.errorMessage) {
    throw new Error(json.errorMessage)
  }
  const { playlists } = json
  return playlists
}
