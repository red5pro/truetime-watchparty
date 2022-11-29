import * as React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Home from './Home'
import JoinContext from '../../components/JoinContext/JoinContext'

const currEpisode = {
  description:
    'He may go by many different names, but to the boxing world, he\'s often referred to as simply "Canelo." A native of Guadalajara, Mexico, Canelo Alvarez had accrued an impressive 42-0-1 heading into arguably the biggest fight of his career at the time, a 2013 bout against none other than Floyd Mayweather Jr.',
  displayName: 'Saúl Álvarez vs Gennady Golovkin',
  endTime: 1693540574459,
  episodeId: 1,
  seriesId: 1,
  startTime: 1663001739719,
  streamGuid: 'live/demo-stream',
}

const singleSerie = {
  displayName: 'New serie from fx',
  episodes: [
    {
      displayName: 'Serie 1',
      endTime: 1667250000000,
      episodeId: 3,
      seriesId: 7,
      startTime: 1667242800000,
    },
  ],
  maxParticipants: 8,
  seriesId: 7,
}

Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: (arr) => arr,
  },
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useHref: () => jest.fn(),
}))

jest.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: () => <div>{'This is the home page'}</div>,
}))

jest.mock('../../services/conference/conference', () => {
  const currentSerie = singleSerie
  const currentEpisode = currEpisode
  const nextEpisodes = []

  return {
    getCurrentEpisode: jest.fn(() => Promise.resolve([currentEpisode, currentSerie, nextEpisodes])),
  }
})

describe('render HomePage', () => {
  test('render content', async () => {
    const values = {
      loading: true,
    }
    render(
      <JoinContext.Provider value={values}>
        <Home />
      </JoinContext.Provider>
    )

    expect(await screen.findByText('This is the home page')).toBeInTheDocument()
  })
})
