export const SERVER_HOST = process.env.SERVER_HOST || 'watchtest.red5.net'
export const API_SERVER_HOST = process.env.API_SERVER_HOST || 'wat-101-sm.red5.net'
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '6LdnYWAhAAAAALa4NtXnet5rmzV-dLTDeuVcIP2a'
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LdnYWAhAAAAABLHrGDm34M2M3gZE4Qy-3o0LMKJ'

export const USE_STREAM_MANAGER = false
export const STREAM_HOST = 'release-11.red5.net' // Should be SERVER_HOST, but for current testing purposes...
export const DEFAULT_CONSTRAINTS = {
  audio: true,
  video: true,
}
