import { Box } from '@mui/material'
import * as React from 'react'
import RoomContext from '../RoomContext/RoomContext'
import useVideoStyles from './SubscribersPanel.module'
import WatchContext from '../WatchContext/WatchContext'
import SubscribersPanel from './SubscribersPanel'
import SubscriberItem from './SubscriberItem/SubscriberItem'

interface ISubscribersPanelProps {
  isPublisher?: boolean
}

const SubscribersPanelList = ({ isPublisher }: ISubscribersPanelProps) => {
  const { classes } = useVideoStyles()
  const watchContext = React.useContext(WatchContext.Context)
  console.log(watchContext.streamsList)

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
      <SubscribersPanel isPublisher={isPublisher} />
      {watchContext.streamsList.map((item: string) => (
        <Box key={item}>
          <SubscriberItem name={item} />
        </Box>
      ))}
    </Box>
  )
}

export default SubscribersPanelList
