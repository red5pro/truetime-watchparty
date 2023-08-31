/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
