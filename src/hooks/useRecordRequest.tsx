import React from 'react'
import { forward, getOrigin } from '../utils/streamManagerUtils'
import { STREAM_HOST } from '../settings/variables'

const DELAY = 5000
const defaultContext = 'live'

export interface RecordRequest {
  host: string
  streamName: string
  accessToken: string
  context: string | null
}

/**
 * Hook to start and stop a recording request.
 * @returns
 */
export function useRecordRequest() {
  let cancelled = false
  const timerRef = React.useRef<any>(null)

  const requestRecord = async (request: RecordRequest) => {
    if (!timerRef.current) {
      return
    }
    const { host, context, streamName, accessToken } = request
    const endpoint = `http://${host}:5080/api/v1/applications/${
      context || defaultContext
    }/streams/${streamName}/action/startrecord?accessToken=${accessToken}`
    const encoded = endpoint
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
    try {
      clearTimeout(timerRef.current)
      const result = await forward(STREAM_HOST, encoded)
      if (!result || result.status !== 'success') {
        // Already started...
        if (result.code !== 409) {
          throw new Error(result.status)
        }
      }
      timerRef.current = undefined
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
