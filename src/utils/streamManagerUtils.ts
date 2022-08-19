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
