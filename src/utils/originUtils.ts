export interface RecordRequest {
  host: string | null
  accessToken: string | null
  streamName: string
}

export const recordLiveStream = async (host: string, context: string, streamName: string, accessToken: string) => {
  const url = `http://${host}:5080/api/v1/applications/${context}/streams/${streamName}/action/startrecord?accessToken=${accessToken}`
  try {
    const response = await fetch(url, { method: 'GET' })
    if (response.status >= 200 || response.status < 300) {
      return response.json()
    } else {
      throw new Error(`Error while request to record live stream: ${streamName}`)
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
