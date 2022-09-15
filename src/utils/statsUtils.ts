import { Column } from '../components/Admin'
import { StatsByConference } from '../models/ConferenceStats'

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
  const data = stats.filter((stat) => stat.endTimeMs >= Date.now())

  const head: Column[] = [
    {
      id: 'PartyName',
      label: 'Party Name',
      minWidth: 100,
    },
    {
      id: 'HostName',
      label: 'Host Name',
    },
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
      label: 'Start Time',
    },
    {
      id: 'EndTime',
      label: 'End Time',
    },
  ]

  const rows = data.map((item: StatsByConference) => ({
    PartyName: item.displayName,
    HostName: 'TODO',
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
  const data = stats.filter((stat) => stat.endTimeMs < Date.now())

  const head: Column[] = [
    {
      id: 'PartyName',
      label: 'Party Name',
      minWidth: 100,
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
      label: 'Start Time',
    },
    {
      id: 'EndTime',
      label: 'End Time',
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

export const getSortedCountryList = (stats: StatsByConference[]) => {
  const countries: { country: string; count: number }[] = []

  stats.forEach((currVall) => {
    if (countries.length === 0) {
      return countries.push({ country: currVall.location, count: 1 })
    }
    const country = countries.find((item: any) => item.country === currVall.location)
    if (country) {
      country.count = +1
      return countries
    }

    return countries.push({ country: currVall.location, count: 1 })
  })

  return countries.sort((a, b) => b.count - a.count)
}
