import * as React from 'react'
import JoinContext from '../../components/JoinContext/JoinContext'
import MediaContext from '../../components/MediaContext/MediaContext'
import VipSteps from '../../components/VipFlow/VipSteps'

const VipJoinPage = () => {
  return (
    <JoinContext.Provider>
      <MediaContext.Provider>
        <VipSteps />
      </MediaContext.Provider>
    </JoinContext.Provider>
  )
}

export default VipJoinPage
