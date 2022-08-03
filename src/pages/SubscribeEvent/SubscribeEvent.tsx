import { Box } from '@mui/material'

import useStyles from './SubscribeEvent.module'
import { useParams } from 'react-router-dom'
import RoomContext from '../../components/RoomContext/RoomContext'
import * as React from 'react'

import Subscriber from '../../components/Subscriber/Subscriber'
import WatchContext from '../../components/WatchContext/WatchContext'
import Publisher from '../../components/Publisher/Publisher'

const SubscribeEvent = () => {
  const params = useParams()
  const classes = useStyles()

  return (
    <Box className={classes.classes.container}>
      <RoomContext.Provider room={params.room ?? ''} mainStreamName={params.stream ?? ''}>
        <WatchContext.Provider>
          {/* <Subscriber /> */}
          <Publisher />
        </WatchContext.Provider>
      </RoomContext.Provider>
    </Box>
  )
}

export default SubscribeEvent
