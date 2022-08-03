import { Box } from '@mui/material'

import useStyles from './SubscribeEvent.module'
import { useParams } from 'react-router-dom'
import RoomContext from '../../components/RoomContext/RoomContext'
import * as React from 'react'
import WatchContext from '../../components/WatchContext/WatchContext'
import Participant from '../../components/Participant/Participant'

const SubscribeEvent = () => {
  const params = useParams()
  const classes = useStyles()

  return (
    <Box className={classes.classes.container}>
      <RoomContext.Provider room={params.room ?? ''} mainStreamName={params.stream ?? ''}>
        <WatchContext.Provider>
          <Participant />
        </WatchContext.Provider>
      </RoomContext.Provider>
    </Box>
  )
}

export default SubscribeEvent
