import React from 'react'
import { getOrigin } from '../utils/streamManagerUtils'
import { RecordRequest, recordLiveStream } from '../utils/originUtils'
import { DEFAULT_ORIGIN_ACCESS_TOKEN, STREAM_HOST } from '../settings/variables'

const DELAY = 5000
const context = 'live'

export function useRecordRequest() {
  let cancelled = false
  const timerRef = React.useRef<any>(null)

  const requestRecord = async (request: RecordRequest) => {
    if (!timerRef.current) {
      return
    }
    const { host, accessToken, streamName } = request
    try {
      if (host) {
        await recordLiveStream(host, context, streamName, accessToken || DEFAULT_ORIGIN_ACCESS_TOKEN)
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      } else {
        const response = await getOrigin(STREAM_HOST, context, streamName)
        const { serverAddress } = response
        await recordLiveStream(serverAddress, context, streamName, accessToken || DEFAULT_ORIGIN_ACCESS_TOKEN)
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    } catch (e) {
      console.error(e)
      if (cancelled) {
        return
      }
      timerRef.current = setTimeout(() => requestRecord(request), DELAY)
    }
  }

  const start = (request: RecordRequest) => {
    if (!timerRef.current) {
      cancelled = false
      const timeout = setTimeout(() => requestRecord(request), DELAY)
      timerRef.current = timeout
      requestRecord(request)
    }
  }

  const stop = () => {
    cancelled = true
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }

  return {
    start,
    stop,
  }
}
