import { Box } from '@mui/material'

import { useParams } from 'react-router-dom'
import WatchContext from '../../components/WatchContext/WatchContext'
import * as React from 'react'
import usePublishStyles from './PublishEvent.module'
import Publisher from '../../components/Publisher/Publisher'
import RoomContext from '../../components/RoomContext/RoomContext'

const PublishEvent = () => {
  const params = useParams()
  const classes = usePublishStyles()

  return (
    <Box className={classes.classes.container}>
      <RoomContext.Provider>
        <WatchContext.Provider>
          <Publisher />
        </WatchContext.Provider>
      </RoomContext.Provider>
    </Box>
  )
}

export default PublishEvent
