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

export const generateFingerprint = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  } else {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, (c) => {
      const r = Math.floor(Math.random() * 16)
      return r.toString(16)
    })
  }
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

export enum ThirdParties {
  FACEBOOK = 'FACEBOOK',
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

export const formatTime = (value: number) => {
  let hrs = 0
  let mins = value === 0 ? 0 : value / 60
  let secs = 0
  if (mins >= 60) {
    hrs = mins / 60
    mins = mins % 60
  }
  secs = value === 0 ? 0 : value % 60

  const formattedArr = []
  if (hrs > 0) {
    hrs < 10 ? formattedArr.push(`0${Math.floor(hrs)}`) : formattedArr.push(Math.floor(hrs).toFixed())
  }
  formattedArr.push(mins < 10 ? `0${Math.floor(mins)}` : Math.floor(mins).toFixed())
  formattedArr.push(secs < 10 ? `0${Math.floor(secs)}` : Math.floor(secs).toFixed())
  return formattedArr.join(':')
}
