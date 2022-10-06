import '@testing-library/jest-dom'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { SERIES_API_CALLS } from '../../services/api/serie-api-calls'
import { STATS_API_CALLS } from '../../services/api/stats-api-calls'

import AdminPage from './AdminPage'

jest.mock('../../hooks/useCookies', () => {
  return () => ({
    getCookies: () => ({
      userAccount: { role: 'ADMIN', username: 'admin', isVerified: true },
      account: { username: 'admin', password: 'admin' },
    }),
  })
})

jest.clearAllMocks()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))
jest.mock('../../services/api/serie-api-calls')
jest.mock('../../services/api/stats-api-calls')

beforeEach(() => {
  jest.useFakeTimers()
})

describe('render AdminPage', () => {
  test('Loading', () => {
    render(<AdminPage />)

    expect(screen.getByText('Watch Party Admin')).toBeInTheDocument()
    expect(document.cookie).toBe('')
  })

  xtest('Call to get Stats', () => {
    const response = {
      curConferences: 6,
      totalConferences: 0,
      maxConferences: 0,
      curParticipants: 0,
      totalParticipants: 0,
      maxParticipants: 0,
      avgParticipants: 0.0,
      devParticipants: 0.0,
      totalViewTimeS: 2730,
      maxViewTimeS: 2049,
      avgViewTimeS: 455,
      devViewTimeS: 318,
    }

    jest.spyOn(STATS_API_CALLS, 'getAllConferenceStats').mockReturnValue(Promise.resolve(response))

    render(<AdminPage />)
    expect(screen.getByText('Number of active main feed viewers')).toBeInTheDocument()

    expect(STATS_API_CALLS.getAllConferenceStats).toBeCalledTimes(1)
  })

  xtest('Call to get Series', () => {
    const response = {}

    SERIES_API_CALLS.getSeriesList.mockResolvedValueOnce(Promise.resolve(response))

    render(<AdminPage />)
    expect(screen.getByText('Watch Party Admin')).toBeInTheDocument()

    expect(SERIES_API_CALLS.getSeriesList).toBeCalledTimes(1)
  })
})
