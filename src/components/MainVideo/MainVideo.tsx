import * as React from 'react'
import SubscriberItem from '../SubscribersPanel/SubscriberItem/SubscriberItem'
import useMainVideoStyles from './MainVideo.module'

const MainVideo = () => {
  const _classes = useMainVideoStyles()

  return <SubscriberItem name={'demo-stream'} />
}

export default MainVideo
