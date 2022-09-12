/* eslint-disable no-unsafe-finally */
import * as React from 'react'

interface ICookieOptions {
  expires?: number | Date | any
  /* Number of days until the cookies expires or an actual `Date` */
  path?: string
  /* Cookie path. Defaults to '/' */
  domain?: string
  /* Cookie domain. Defaults to website domain */
  secure?: boolean
  /* defaults to false */
  samesite?: 'Lax' | 'None' | 'Strict'
  /* Defaults to `Lax` */
}

const getNamesCookies = (names: string[]) => {
  let objResponse = {}
  names.map((key: string) =>
    document.cookie.split('; ').reduce((all: any, current: any) => {
      const item = current.split('=')
      const storedKey = item[0]
      let storedValue = item[1]

      try {
        storedValue = JSON.parse(decodeURIComponent(item[1]))
      } catch {
        storedValue = item[1]
      } finally {
        if (storedKey === key && storedValue) {
          objResponse = {
            ...objResponse,
            [key]: storedValue,
          }

          return objResponse
        }
        return all
      }
    }, undefined)
  )

  return objResponse
}

const parseObjToStringOptions = (obj: any) => {
  let str = ''
  const hasExpiration = Object.keys(obj).includes('expires')

  const date = new Date()
  date.setDate(date.getDate() + 4)

  const objC = hasExpiration ? obj : { ...obj, expires: date.toUTCString() }

  for (const p in objC) {
    if (Object.prototype.hasOwnProperty.call(objC, p)) {
      str += ';' + p + '=' + decodeURIComponent(objC[p].toString())
    }
  }
  return str
}

const useCookies = (keys: string[]) => {
  const [cookies, setCookies] = React.useState<any>(getNamesCookies(keys))

  const setCookie = (key: string, value: any, options?: ICookieOptions) => {
    const opt = options ? parseObjToStringOptions(options) : ''
    const val = typeof value === 'object' ? encodeURI(JSON.stringify(value)) : value.toString()

    document.cookie = `${key}=${val}${opt}`
    setCookies(getNamesCookies(keys))
  }

  const removeCookie = (key: string) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    if (cookies && Object.prototype.hasOwnProperty.call(cookies, key)) {
      delete cookies[key]
      setCookies(cookies)
    }
  }

  return [cookies, setCookie, removeCookie]
}

export default useCookies