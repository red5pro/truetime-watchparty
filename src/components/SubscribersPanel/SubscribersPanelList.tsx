import { Box } from '@mui/material'
import * as React from 'react'
import RoomContext from '../RoomContext/RoomContext'
import WatchContext from '../WatchContext/WatchContext'
import CurrentStreamVideo from './SubscribersPanel'
import SubscriberItem from './SubscriberItem/SubscriberItem'

const SubscribersPanelList = () => {
  const roomContext = React.useContext(RoomContext.Context)
  const watchContext = React.useContext(WatchContext.Context)

  return (
    <Box>
      {watchContext.streamsList.map((item: string) => (
        <Box key={item}>
          <SubscriberItem room={roomContext ? roomContext.room : ''} name={item} shouldAddToMap />
        </Box>
      ))}
      <CurrentStreamVideo />
    </Box>
  )
}

export default SubscribersPanelList
