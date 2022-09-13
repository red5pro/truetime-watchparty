import * as React from 'react'

import MediaContext from '../../components/MediaContext/MediaContext'
import VipSteps from '../../components/VipFlow/VipSteps'
import VipJoinContext from '../../components/VipJoinContext/VipJoinContext'
const VipJoinPage = () => {
  return (
    <VipJoinContext.Provider>
      <MediaContext.Provider>
        <VipSteps />
      </MediaContext.Provider>
    </VipJoinContext.Provider>
  )
}

export default React.memo(VipJoinPage)
