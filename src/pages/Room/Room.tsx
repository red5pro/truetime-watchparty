// TODO: Mark for deprecation
import { Box } from '@mui/material'

import useStyles from './Room.module'
import { useParams } from 'react-router-dom'
import RoomContext from '../../components/RoomContext/RoomContext'
import * as React from 'react'

import Subscriber from '../../components/Subscriber/Subscriber'

const Room = () => {
  const params = useParams()
  const classes = useStyles()

  return (
    <Box className={classes.classes.container}>
      <RoomContext.Provider room={params.room ?? ''}>
        <Subscriber
          useStreamManager={false}
          resubscribe={false}
          host=""
          streamGuid=""
          styles={{}}
          mute={false}
          showControls={true}
        />
      </RoomContext.Provider>
    </Box>
  )
}

export default Room
