export const USE_LOCAL_SERVICES = false

export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'wat-142-sm.red5.net'
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || 'wat-142-sm.red5.net'
export const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conferenceapi/1.0`
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LdnYWAhAAAAALa4NtXnet5rmzV-dLTDeuVcIP2a'
export const RECAPTCHA_SECRET_KEY =
  process.env.REACT_APP_RECAPTCHA_SECRET_KEY || '6LdnYWAhAAAAABLHrGDm34M2M3gZE4Qy-3o0LMKJ'

export const USE_STREAM_MANAGER = process.env.REACT_APP_SM === '1' || true
export const API_SOCKET_HOST = USE_LOCAL_SERVICES
  ? 'ws://localhost:8001'
  : `wss://${API_SERVER_HOST}/conferenceapi/1.0/ws/conference`
export const STREAM_HOST = USE_LOCAL_SERVICES ? 'release-11.red5.net' : SERVER_HOST
export const VOD_SOCKET_HOST = process.env.REACT_VOD_SOCKET_HOST
  ? `wss://${process.env.REACT_VOD_SOCKET_HOST}`
  : // : `wss://toddred5dev543.red5pro.net`
    'wss://f6cf-2601-19b-c700-93f0-c0fd-a6dc-6954-46c0.ngrok.io'

export const VOD_HOST = SERVER_HOST
export const VOD_CONTEXT = 'live'

export const DEFAULT_CONSTRAINTS = {
  audio: true,
  video: true,
}
export const FORCE_LIVE_CONTEXT = true
export const ENABLE_MUTE_API = true
export const ENABLE_DEBUG_UTILS = true

export const PUBLISH_API_KEY = process.env.REACT_APP_PUBLISH_API_KEY
export const SUBSCRIBE_API_KEY = process.env.REACT_APP_SUBSCRIBE_API_KEY
export const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID
