import moment from 'moment'

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

export const generateFingerprint = () => {
  return crypto.randomUUID()
}

export const getStartTimeFromTimestamp = (ts: number) => {
  return moment(ts).format('MMMM Do, h:mm a')
}

export enum UserRoles {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
}

export enum MessageTypes {
  ERROR = 'ConferenceError',
  JOIN_RESPONSE = 'JoinConferenceResponse',
  STATE_EVENT = 'ConferenceStateEvent',
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
