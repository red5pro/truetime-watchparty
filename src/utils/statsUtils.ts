import { Column } from '../components/Admin'
import { StatsByConference } from '../models/ConferenceStats'

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0')
}

const getDate = (miliseconds: number) => {
  const date = new Date(miliseconds)

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
    isToday ? 'Today' : [padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate()), date.getFullYear()].join('-')
  }  ${[hours, padTo2Digits(date.getMinutes())].join(':')} ${ampm}`

  return response
}

export const mapLiveStatsData = (data: StatsByConference[]) => {
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
    Viewers: item.curParticipants,
    TotalViewers: item.totalParticipants,
    TimeEngaged: item.avgViewTimeS,
    HasSpecialGuest: item.vipVisited ? 'Has Guest' : 'Has No Guest',
    StartTime: getDate(item.startTimeMs),
    EndTime: getDate(item.endTimeMs),
  }))

  return { head, rows }
}
