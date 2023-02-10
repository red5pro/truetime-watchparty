import { SM_ACCESS_TOKEN } from '../settings/variables'
import { Stream, VODStream } from './../models/Stream'

const urlReg = /^https/

const getOriginFromGroup = async (host: string, groupName: string, accessToken: string) => {
  const url = `https://${host}/streammanager/api/4.0/admin/nodegroup/${groupName}/node/origin?accessToken=${accessToken}`
  const response = await fetch(url)
  const origins = await response.json()
  return origins.map((o: any) => o.address)
}

const getVODOrigins = async (host: string, context: string, name: string, accessToken: string) => {
  const nodeGroupsUrl = `https://${host}/streammanager/api/4.0/admin/nodegroup?accessToken=${accessToken}`
  const response = await fetch(nodeGroupsUrl)
  const nodeGroups = await response.json()
  const originAsyncs = await Promise.allSettled(
    nodeGroups.map(async (g: any) => await getOriginFromGroup(host, g.name, accessToken))
  )
  const origins = originAsyncs
    .filter((o: any) => o.status === 'fulfilled')
    .map((o: any) => o.value)
    .flat(1)

  return origins
}

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
  let vods = mediafiles.filter((s: VODStream) => mp4Reg.exec(s.name))
  if (!useCloud) {
    try {
      const origins = await getVODOrigins(host, context, 'stream', SM_ACCESS_TOKEN)
      if (origins.length > 0) {
        // fullUrl => /:context/streams/:url
        vods = vods.map((vod: VODStream) => {
          vod.fullUrl = `http://${origins[0]}:5080/${context}/streams/${vod.url}`
          return vod
        })
      }
    } catch (e: any) {
      // meh...
      console.error(e)
    }
  }
  return vods
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
  let vods = playlists
  if (!useCloud) {
    try {
      const origins = await getVODOrigins(host, context, 'stream', SM_ACCESS_TOKEN)
      if (origins.length > 0) {
        // fullUrl => /:context/:url
        vods = vods.map((vod: VODStream) => {
          vod.fullUrl = `http://${origins[0]}:5080/${context}/${vod.url}`
          return vod
        })
      }
    } catch (e: any) {
      // meh...
      console.error(e)
    }
  }
  return vods
}
