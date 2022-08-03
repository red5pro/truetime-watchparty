import { SessionStorage } from './sessionStorageUtils'

export const getConfiguration = () => {
  const conf = SessionStorage.get('r5proTestBed')

  try {
    return JSON.parse(conf)
  } catch (e: any) {
    console.error('Could not read testbed configuration from sessionstorage: ' + e.message)
    return {}
  }
}

export const getServerSettings = () => {
  const settings = SessionStorage.get('r5proServerSettings')
  try {
    return JSON.parse(settings)
  } catch (e: any) {
    console.error('Could not read server settings from sessionstorage: ' + e.message)
    return {}
  }
}

export const getAuthenticationParams = (configuration: any) => {
  const auth = configuration.authentication
  return auth && auth.enabled
    ? {
        connectionParams: {
          username: auth.username,
          password: auth.password,
        },
      }
    : {}
}

export const getSocketLocationFromProtocol = () => {
  const settings = getServerSettings()
  const isSecure = window.location.protocol.includes('https')

  return !isSecure
    ? { protocol: 'ws', port: settings?.wsport ?? '' }
    : { protocol: 'wss', port: settings?.wssport ?? '' }
}
