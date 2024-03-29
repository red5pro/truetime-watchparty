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
import { Episode } from './../models/Episode'
import { UserRoles } from './commonUtils'
import { Column } from '../components/Admin'
import { StatsByConference } from '../models/ConferenceStats'
import { UserAccount } from '../models/UserAccount'
import { Serie } from '../models/Serie'

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0')
}

const getDate = (milliseconds: number) => {
  const date = new Date(milliseconds)

  let hours = padTo2Digits(date.getHours())
  let ampm = 'AM'

  if (date.getHours() > 13) {
    hours = padTo2Digits(date.getHours() - 12)
    ampm = 'PM'
  } else if (date.getHours() === 12) {
    ampm = 'PM'
  }

  /* If event date starts/ends today */
  let isToday = false

  const today = new Date()

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth()
  ) {
    isToday = true
  }

  const response = `${
    isToday
      ? 'Today at'
      : [padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate()), date.getFullYear()].join('-')
  }  ${[hours, padTo2Digits(date.getMinutes())].join(':')} ${ampm}`

  return response
}

const getTime = (milliseconds: number) => {
  let seconds = milliseconds
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60
  hours = hours % 24

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
}

export const mapLiveStatsData = (stats: StatsByConference[]) => {
  if (!stats || stats.length === 0) {
    return { head: [], rows: [] }
  }

  const data = stats.filter(
    (stat) => (stat.endTimeMs >= Date.now() && stat.curParticipants === 0) || stat.curParticipants > 0
  )

  const head: Column[] = [
    {
      id: 'PartyName',
      label: 'Party Name',
      minWidth: 100,
    },
    // {
    //   id: 'HostName',
    //   label: 'Host Name',
    // },
    {
      id: 'Viewers',
      label: 'Viewers',
    },
    {
      id: 'TotalViewers',
      label: 'Total Viewers',
    },
    {
      id: 'TimeEngaged',
      label: 'Time Engaged',
    },
    {
      id: 'HasSpecialGuest',
      label: 'Has Special Guest',
    },
    {
      id: 'StartTime',
      label: 'Start Date/Time',
    },
    {
      id: 'EndTime',
      label: 'End Date/Time',
    },
  ]

  const rows = data.map((item: StatsByConference) => ({
    PartyName: item.displayName,
    // HostName: 'TODO',
    Viewers: item.maxParticipants,
    TotalViewers: item.totalParticipants,
    TimeEngaged: getTime(item.totalViewTimeS),
    HasSpecialGuest: item.vipVisited ? 'Has Guest' : 'Has No Guest',
    StartTime: getDate(item.startTimeMs),
    EndTime: getDate(item.endTimeMs),
  }))

  return { head, rows }
}

export const mapPastEventsStatsData = (stats: StatsByConference[]) => {
  if (!stats || stats.length === 0) {
    return { head: [], rows: [] }
  }

  const data = stats.filter((stat) => stat.endTimeMs < Date.now())

  const head: Column[] = [
    {
      id: 'PartyName',
      label: 'Party Name',
      // minWidth: 100,
    },
    {
      id: 'TotalViewers',
      label: 'Total Viewers',
    },
    {
      id: 'PeakViewership',
      label: 'Peak Viewership',
    },
    {
      id: 'PeakViewTime',
      label: 'Peak View Time',
    },
    {
      id: 'StartTime',
      label: 'Start Date/Time',
    },
    {
      id: 'EndTime',
      label: 'End Date/Time',
    },
    {
      id: 'Duration',
      label: 'Duration',
    },
    {
      id: 'Kicked',
      label: 'Kicked',
    },
  ]

  const rows = data.map((item: StatsByConference) => ({
    PartyName: item.displayName,
    TotalViewers: item.totalParticipants,
    PeakViewership: item.maxParticipants,
    PeakViewTime: getTime(item.maxViewTimeS),
    StartTime: getDate(item.startTimeMs),
    EndTime: getDate(item.endTimeMs),
    Duration: getTime(Math.round((item.endTimeMs - item.startTimeMs) / 1000)),
    Kicked: item.numKicked,
  }))

  return { head, rows }
}

export const mapSpecialGuestsStatsData = (stats: UserAccount[]) => {
  if (!stats || stats.length === 0) {
    return { head: [], rows: [] }
  }

  const data = stats.filter((stat) => stat.role === UserRoles.VIP)

  const head: Column[] = [
    // {
    //   id: 'GuestName',
    //   label: 'Guest Name',
    //   minWidth: 100,
    // },
    {
      id: 'Email',
      label: 'Email',
    },
    {
      id: 'AccountVerified',
      label: 'Account Is Verified',
    },
    // {
    //   id: 'Event',
    //   label: 'Event',
    // },
    // {
    //   id: 'Date',
    //   label: 'Date',
    // },
    // {
    //   id: 'Duration',
    //   label: 'Duration',
    // },
    // {
    //   id: 'Parties',
    //   label: 'Parties',
    // },
    {
      id: 'Type',
      label: 'Type',
    },
  ]

  const rows = data.map((item: UserAccount) => ({
    // GuestName: 'TODO',
    Email: item.username,
    AccountVerified: item.isVerified ? 'TRUE' : 'FALSE',
    // Event: 'TODO',
    // Date: 'TODO',
    // Duration: 'TODO',
    // Parties: 'TODO',
    Type: item.role,
  }))

  return { head, rows }
}

export const mapSeriesStatsData = (data: Serie[]) => {
  if (!data || data.length === 0) {
    return { head: [], rows: [] }
  }

  const head: Column[] = [
    {
      id: 'SeriesName',
      label: 'Series Name',
      minWidth: 100,
    },
    {
      id: 'StartDate',
      label: 'Start Date/Time',
    },
    {
      id: 'EndDate',
      label: 'End Date/Time',
    },
    {
      id: 'TotalViewers',
      label: 'Total Viewers',
    },
    {
      id: 'TotalEvents',
      label: 'Total Events',
    },
  ]

  // TODO: Need Real Series Stats endpoint here
  const rows = data.map((item: Serie) => {
    let startDateTime = item.episodes?.[0]?.startTime
    let endDateTime = item.episodes?.[0]?.endTime

    item.episodes.forEach((episode: Episode) => {
      if (episode.startTime < startDateTime) {
        startDateTime = episode.startTime
      }
      if (episode.endTime > endDateTime) {
        endDateTime = episode.endTime
      }
    })

    return {
      SeriesName: item.displayName,
      StartDate: startDateTime ? getDate(startDateTime) : '-',
      EndDate: endDateTime ? getDate(endDateTime) : '-',
      TotalViewers: item.maxParticipants,
      TotalEvents: item.episodes.length,
    }
  })

  return { head, rows }
}

export const getSortedCountryList = (stats: StatsByConference[]) => {
  const countries: { country: string; count: number }[] = []

  if (!stats || stats.length === 0) {
    return []
  }

  stats.forEach((currVall) => {
    if (countries.length === 0) {
      return countries.push({ country: currVall.location, count: 1 })
    }
    const countryRep = countries.find((i) => i.country === currVall.location)

    if (countryRep) {
      countryRep.count += 1
      return countries
    }

    return countries.push({ country: currVall.location, count: 1 })
  })

  return countries.sort((a, b) => b.count - a.count)
}
