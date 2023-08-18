import { AccountCredentials } from '../models/AccountCredentials'
import { WebbAppMode } from '../utils/variableUtils'

export const USE_LOCAL_SERVICES = false

export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost'
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || 'localhost'
export const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conference-api/1.0`
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'ADDME'
export const RECAPTCHA_SECRET_KEY = process.env.REACT_APP_RECAPTCHA_SECRET_KEY || 'ADDME'

export const USE_STREAM_MANAGER = process.env.REACT_APP_SM === '1' || true
export const PREFER_WHIP_WHEP = process.env.REACT_APP_PREFER_WHIP_WHEP === '1' || true
export const API_SOCKET_HOST = USE_LOCAL_SERVICES
  ? 'ws://localhost:8001'
  : `wss://${API_SERVER_HOST}/conference-api/1.0/ws/conference`
export const STREAM_HOST = USE_LOCAL_SERVICES ? 'localhost' : SERVER_HOST

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

const WEBAPP_MODE = process.env.REACT_APP_WEBAPP_MODE || WebbAppMode.WATCHPARTY

export const isWatchParty = WEBAPP_MODE === WebbAppMode.WATCHPARTY
export const adminAccount: AccountCredentials = {
  email: process.env.REACT_APP_ADMIN_USER,
  password: process.env.REACT_APP_ADMIN_PASS,
}
