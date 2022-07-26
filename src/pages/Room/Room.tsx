import { Box } from '@mui/material'

import useStyles from './Room.module'
import { useParams } from 'react-router-dom'
import RoomContext from '../../components/RoomContext/RoomContext'
import * as React from 'react'

import Subscriber from '../../components/Subscriber/Subscriber'
import WatchContext from '../../components/WatchContext/WatchContext'

const Room = () => {
  const params = useParams()
  const classes = useStyles()

  return (
    <Box className={classes.classes.container}>
      <RoomContext.Provider room={params.room ?? ''}>
        <WatchContext.Provider>
          <Subscriber room={params.room ?? ''} />
        </WatchContext.Provider>
      </RoomContext.Provider>
    </Box>
  )
}

export default Room
