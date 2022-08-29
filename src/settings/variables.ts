export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'watchtest.red5.net'
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || 'wat-101-sm.red5.net'
export const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conferenceapi/1.0`
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LdnYWAhAAAAALa4NtXnet5rmzV-dLTDeuVcIP2a'
export const RECAPTCHA_SECRET_KEY =
  process.env.REACT_APP_RECAPTCHA_SECRET_KEY || '6LdnYWAhAAAAABLHrGDm34M2M3gZE4Qy-3o0LMKJ'

export const USE_STREAM_MANAGER = false
export const API_SOCKET_HOST = 'localhost' // Should be API_SERVER_HOST, but for current testing purposes...
export const FORCE_LIVE_CONTEXT = true
export const STREAM_HOST = 'release-11.red5.net' // Should be SERVER_HOST, but for current testing purposes...
export const DEFAULT_CONSTRAINTS = {
  audio: true,
  video: true,
}
export const ENABLE_MUTE_API = true

export const PUBLISH_API_KEY = process.env.REACT_APP_PUBLISH_API_KEY
export const SUBSCRIBE_API_KEY = process.env.REACT_APP_SUBSCRIBE_API_KEY
