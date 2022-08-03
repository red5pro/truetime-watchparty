import { Box, Typography } from '@mui/material'
import * as React from 'react'
import RoomContext from '../RoomContext/RoomContext'
import useVideoStyles from './SubscribersPanel.module'
import WatchContext from '../WatchContext/WatchContext'
import CurrentStreamVideo from './SubscribersPanel'
import SubscriberItem from './SubscriberItem/SubscriberItem'

const SubscribersPanelList = () => {
  const { classes } = useVideoStyles()
  const roomContext = React.useContext(RoomContext.Context)
  const watchContext = React.useContext(WatchContext.Context)

  React.useEffect(() => {
    if (watchContext.streamsList.length) {
      showSubscribersInPanel()
    }
  }, [watchContext.streamsList, watchContext.streamsList.length])

  const showSubscribersInPanel = async () => {
    console.log('showSubscribersInPanel', watchContext.streamsList)
  }

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
