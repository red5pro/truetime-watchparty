import * as React from 'react'
import Box from '@mui/material/Box'
import CardComponent from './CardComponent'
import { AllConferenceStats } from '../../../models/ConferenceStats'

interface IMainTotalValuesProps {
  stats: AllConferenceStats
}

const MainTotalValues = ({ stats }: IMainTotalValuesProps) => {
  return (
    <Box display="flex" justifyContent="space-around">
      <CardComponent text="Number of active main feed viewers" value={stats.curParticipants} />
      <CardComponent text="Number of active conferences" value={stats.curConferences} />
      <CardComponent text="Average number of participants per conference" value={stats.avgParticipants} />
      <CardComponent text="Average conference length in seconds" value={stats.avgViewTimeS} />
    </Box>
  )
}

export default MainTotalValues
