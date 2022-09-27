import { describe, expect, test } from '@jest/globals'
import { generateJoinToken, getContextAndNameFromGuid, getStartTimeFromTimestamp } from './commonUtils'

describe('commonUtils module', () => {
  test('generate join token', () => {
    expect(generateJoinToken()).toHaveLength(19)
  })

  test('get context and name from guid', () => {
    expect(getContextAndNameFromGuid('live/testGKzm')).toStrictEqual({
      context: 'live',
      name: 'testGKzm',
    })
  })

  test('parse timestamp', () => {
    const ts = 1663802545223
    const date = 'September 21st, 8:22 pm'
    expect(getStartTimeFromTimestamp(ts)).toBe(date)
  })
})
