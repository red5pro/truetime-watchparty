export const MOCK_API_CALLS = {
  getSeriesList: () => {
    return {
      status: 200,
      data: {
        series: [
          {
            seriesId: 1,
            displayName: 'Test Series Kgg1RHqq',
            description: 'An example series',
            maxParticipants: 8,
            episodes: [
              {
                episodeId: 1,
                seriesId: 1,
                streamGuid: 'live/testMHzJ',
                displayName: 'Test Episode fhF3MGkC',
                startTime: 1662253988714,
                endTime: 1693876388714,
              },
            ],
          },
        ],
      },
    }
  },
  getCurrentEpisode: () => {
    return {
      status: 200,
      data: {
        episodeId: 1,
        seriesId: 1,
        streamGuid: 'live/testMHzJ',
        displayName: 'Test Episode fhF3MGkC',
        startTime: 1662253988714,
        endTime: 1693876388714,
      },
    }
  },
  // getAllEpisodesBySerie,
  // getConferenceDetails,
  getJoinDetails: () => {
    return {
      status: 200,
      data: {
        displayName: 'My Conference',
        welcomeMessage: 'Welcome to my conference! We\u0027re going to have a great time! You\u0027ll love it!',
        thankYouMessage: 'Thanks for joining, see you next time!',
        location: 'United States of America',
        joinLocked: false,
        vipOkay: true,
        participants: [
          {
            displayName: 'LynardMaffeus',
            role: 'ORGANIZER',
          },
          {
            displayName: 'RolindaWilken',
            role: 'PARTICIPANT',
          },
        ],
      },
    }
  },
  // createConference,
  // getAllConferences,
  // getConferenceParticipants,
  // lockConference,
  // unlockConference,
  // muteParticipant,
  // banParticipant,
  getConferenceLoby: () => {
    return {
      status: 200,
      data: {
        displayName: 'My Conference',
        welcomeMessage: 'Welcome to my conference! We\u0027re going to have a great time! You\u0027ll love it!',
        thankYouMessage: 'Thanks for joining, see you next time!',
        location: 'United States of America',
        joinLocked: false,
        vipOkay: true,
        participants: [
          {
            displayName: 'LynardMaffeus',
            role: 'ORGANIZER',
          },
          {
            displayName: 'RolindaWilken',
            role: 'PARTICIPANT',
          },
        ],
      },
    }
  },
}
