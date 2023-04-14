export const USE_LOCAL_SERVICES = false

export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost'
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || 'localhost'
export const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conference-api/1.0`
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'ADDME'
export const RECAPTCHA_SECRET_KEY = process.env.REACT_APP_RECAPTCHA_SECRET_KEY || 'ADDME'

export const USE_STREAM_MANAGER = process.env.REACT_APP_SM === '0' || true
export const API_SOCKET_HOST = USE_LOCAL_SERVICES
  ? 'ws://localhost:8001'
  : `wss://${API_SERVER_HOST}/conference-api/1.0/ws/conference`
export const STREAM_HOST = USE_LOCAL_SERVICES ? 'localhost' : SERVER_HOST
export const VOD_SOCKET_HOST = process.env.REACT_APP_VOD_SOCKET_HOST
  ? `wss://${process.env.REACT_APP_VOD_SOCKET_HOST}`
  : `wss://toddred5dev543.red5.net`
// 'wss://922b-2601-19b-c700-93f0-d5d9-677c-6ae5-abc.ngrok.io'

export const VOD_HOST = process.env.REACT_APP_VOD_HOST || SERVER_HOST
export const VOD_CONTEXT = process.env.REACT_APP_VOD_CONTEXT || 'live'

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
