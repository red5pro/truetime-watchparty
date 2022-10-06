import { describe, expect, test } from '@jest/globals'
import * as commonUtils from './commonUtils'

jest.clearAllMocks()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'https://watchparty-spa.red5pro.net?test=thisisatest',
    search: '?test=thisisatest',
  }),
}))

describe('commonUtils module', () => {
  test('generateJoinToken', () => {
    expect(commonUtils.generateJoinToken()).toHaveLength(19)
  })

  test('getContextAndNameFromGuid', () => {
    expect(commonUtils.getContextAndNameFromGuid('live/testGKzm')).toStrictEqual({
      context: 'live',
      name: 'testGKzm',
    })
  })

  test('getStartTimeFromTimestamp', () => {
    const ts = 1663802545223
    const date = 'September 21st, 8:22 pm'
    expect(commonUtils.getStartTimeFromTimestamp(ts)).toBe(date)
  })

  test('getQueryParams', () => {
    const name = 'test'

    expect(commonUtils.getQueryParams(name)).toBe('thisisatest')
  })
})
