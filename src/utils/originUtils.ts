export const recordLiveStream = async (host: string, context: string, streamName: string, accessToken: string) => {
  const endpoint = `http://${host}:5080/api/v1/applications/${context}/streams/${streamName}/action/startrecord?accessToken=${accessToken}`
  const encoded = endpoint
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
  const url = encoded.toUpperCase()
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
