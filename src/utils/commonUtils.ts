import moment from 'moment'

export const removeFromArray = (arr: any[], args: any[]) => arr.filter((val) => !args.includes(val))

export const getContextAndNameFromGuid = (guid: string) => {
  const paths: string[] = guid.split('/')
  const name = paths.pop()
  return { name: name, context: paths.join('/') }
}

export const generateFingerprint = () => {
  return crypto.randomUUID()
}

export const getStartTimeFromTimestamp = (ts: number) => {
  return moment(ts).format('MMMM Do YYYY, h:mm:ss a')
}

export enum UserRoles {
  ORGANIZER = 'ORGANIZER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
}
