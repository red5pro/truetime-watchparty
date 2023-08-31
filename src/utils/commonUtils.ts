import moment from 'moment'
import { useLocation } from 'react-router-dom'

export const removeFromArray = (arr: any[], args: any[]) => arr.filter((val) => !args.includes(val))

export interface IStepActionsSubComponent {
  onNextStep: () => void
  onBackStep: () => void
}

export const getContextAndNameFromGuid = (guid: string) => {
  const paths: string[] = guid.split('/')
  const name = paths.pop()
  return { name: name, context: paths.join('/') }
}

function uuid() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

export const generateFingerprint = () => {
  let value
  try {
    value = crypto.randomUUID()
  } catch (e) {
    value = uuid()
  }
  return value
}

export const getStartTimeFromTimestamp = (ts: number) => {
  return moment(ts).format('MMMM Do, h:mm a')
}

export enum Paths {
  ANONYMOUS = '/join/anon',
  ANONYMOUS_THANKYOU = '/thankyou/anon',
}

export enum UserRoles {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
  ANONYMOUS = 'ANONYMOUS',
  COHOST = 'COHOST',
}

export enum ThirdParties {
  FACEBOOK = 'FACEBOOK',
}

export enum MessageTypes {
  ERROR = 'ConferenceError',
  JOIN_RESPONSE = 'JoinConferenceResponse',
  STATE_EVENT = 'ConferenceStateEvent',
  SHARESCREEN_UPDATE_EVENT = 'UpdateScreenShareEvent',
}

export const parseQueryParamToObject = (query: string) => {
  let obj = {}
  const res = query.replace('?', '')

  res.split('&').map((stg: string) => {
    const s = stg.split('=')
    const value = s[1].toLowerCase() === 'true' || s[1] === '1' ? true : false
    obj = Object.assign(obj, { [s[0]]: value })
  })

  return obj
}

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export const generateJoinToken = (length = 16) => {
  let result = ''
  const charactersLength = CHARS.length
  for (let i = 0; i < length; i++) {
    if (i === 4 || i === 8 || i === 12) {
      result += '-'
    }
    result += CHARS.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const isMobileScreen = () => (window && window.innerWidth <= 600 ? true : false)

export const getQueryParams = (name: string) => {
  const queryParams = useLocation().search

  let value = ''

  if (queryParams.includes(name)) {
    const queries = queryParams.split('&')

    queries.forEach((item: string) => {
      if (item.includes(name)) {
        const str = item.slice(item.indexOf(`${name}=`), item.length)
        value = decodeURI(str.substring(`${name}=`.length, item.length))
      }

      return
    })
  }

  return value
}

export const noop = () => {
  /* no operation */
}
