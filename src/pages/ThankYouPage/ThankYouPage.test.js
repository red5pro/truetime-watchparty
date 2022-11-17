import '@testing-library/jest-dom'
import * as React from 'react'
import { render, screen } from '@testing-library/react'

import ThankYouPage from './ThankYouPage'
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

jest.mock('../../hooks/useCookies', () => {
  return () => ({
    getCookies: () => ({
      userAccount: { role: 'ADMIN', username: 'admin', isVerified: true },
      account: { username: 'admin', password: 'admin' },
    }),
  })
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

jest.mock('../../services/conference/conference', () => {
  const currentSerie = singleSerie
  const currentEpisode = currEpisode
  const nextEpisodes = []

  return {
    getCurrentEpisode: jest.fn(() => Promise.resolve([currentEpisode, currentSerie, nextEpisodes])),
  }
})
jest.mock('../../services/api/conference-api-calls', () => {
  return {
    getConferenceLoby: jest.fn(() => Promise.resolve({ data: { joinToken: '5qco-9zfw-bdy8-f63k' } })),
    getCurrentEpisode: jest.fn(() => Promise.resolve({ data: currEpisode })),
  }
})
jest.mock('../../services/api/serie-api-calls', () => {
  return {
    getSeriesList: jest.fn(() => Promise.resolve([singleSerie])),
  }
})

describe('render ThankYouPage', () => {
  test('loading', async () => {
    const values = {
      loading: true,
    }
    render(
      <JoinContext.Provider value={values}>
        <ThankYouPage />
      </JoinContext.Provider>
    )

    expect(await screen.findByTestId('thankyou-page')).toBeInTheDocument()
  })

  test('display greetings', async () => {
    const values = {
      conferenceData: {
        displayName: 'Party name',
        joinLocked: false,
        location: 'Antarctica',
        participants: [],
        thankYouMessage: 'thank you msg test!',
        vipOkay: true,
        welcomeMessage: 'welcome msg',
      },
      joinToken: '5qco-9zfw-bdy8-f63k',
      seriesEpisode: {
        episode: {
          episodeId: 1,
          seriesId: 1,
          streamGuid: 'live/demo-stream',
          displayName: 'Saúl Álvarez vs Gennady Golovkin',
          description:
            'He may go by many different names, but to the boxi…bout against none other than Floyd Mayweather Jr.',
        },
        loaded: true,
        locked: false,
        series: {
          seriesId: 1,
          displayName: 'Series 1',
          description: 'An example Series',
          maxParticipants: 10,
          episodes: [
            {
              episodeId: 1,
              seriesId: 1,
              streamGuid: 'live/demo-stream',
              displayName: 'Saúl Álvarez vs Gennady Golovkin',
              description:
                'He may go by many different names, but to the boxi…bout against none other than Floyd Mayweather Jr.',
            },
            {
              episodeId: 2,
              seriesId: 1,
              displayName: 'Event Name test',
              startTime: 1664506800000,
              endTime: 1664506800000,
            },
            {
              episodeId: 5,
              seriesId: 1,
              displayName: 'Test Serie 2',
              startTime: 1669931940000,
              endTime: 1669939260000,
            },
          ],
        },
      },
    }
    render(
      <JoinContext.Provider value={values}>
        <ThankYouPage />
      </JoinContext.Provider>
    )
    expect(await screen.findByText('Saúl Álvarez vs Gennady Golovkin')).toBeInTheDocument()
    expect(await screen.findByText('September 12th, 1:55 pm')).toBeInTheDocument()
    expect(await screen.findByAltText('Thank you Page Main Image')).toBeInTheDocument()
    expect(await screen.findByTestId('series-episode-load')).toBeInTheDocument()
  })
})
