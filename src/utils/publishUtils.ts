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
