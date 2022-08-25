import * as React from 'react'
import JoinContext from '../../components/JoinContext/JoinContext'
import VipSteps from '../../components/VipFlow/VipSteps'

const VipJoinPage = () => {
  return (
    <JoinContext.Provider>
      <VipSteps />
    </JoinContext.Provider>
  )
}

export default VipJoinPage
