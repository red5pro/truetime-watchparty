import { Box, Stepper } from '@mui/material'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { IAccount } from '../../models/Account'
import { Conference } from '../../models/Conference'
import { Episode } from '../../models/Episode'
import { getAllConferences, getCurrentEpisode } from '../../services/conference/conference'

import { IStepActionsSubComponent } from '../../utils/commonUtils'
import Signin from '../Account/Signin/Signin'
import JoinContext from '../JoinContext/JoinContext'
import MediaContext from '../MediaContext/MediaContext'
import WatchContext from '../WatchContext/WatchContext'
import VipJoinWatchparty from './VipJoinWatchparty/VipJoinWatchparty'
import useStyles from './VipSteps.module'
import VipTimer from './VipTimer/VipTimer'
import VipView from './VipView/VipView'

enum VipStepIdentify {
  LANDING = 0,
  SIGN_IN = 1,
  TIMER = 2,
  JOIN_WATCH_PARTY = 3,
}

const VipSteps = () => {
  const [cookies] = useCookies(['account'])
  const [activeStep, setActiveStep] = React.useState(0)
  const [account, setAccount] = React.useState<IAccount>()
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()
  const [allConferences, setAllConferences] = React.useState<Conference[]>()
  const [currentConference, setCurrentConference] = React.useState<Conference>()
  const [startedCountdown, setStartedCountdown] = React.useState<boolean>(false)

  const { classes } = useStyles()

  React.useEffect(() => {
    getCurrentEvent()

    if (cookies.account) {
      setAccount(cookies.account)
      getConferences(cookies.account)
    }
  }, [cookies])

  const getConferences = async (account: IAccount) => {
    const conf = await getAllConferences(account)

    if (conf.data?.conferences && conf.status === 200) {
      const data = conf.data.conferences
      setAllConferences(data)
      setCurrentConference(data[0])
    }
  }

  const getCurrentEvent = async () => {
    const [currentEpisode] = await getCurrentEpisode()

    setCurrentEpisode(currentEpisode)
  }

  const joinNextConference = () => {
    const nextConfIndex =
      allConferences?.findIndex((item) => item.conferenceId === currentConference?.conferenceId) || 0

    if (nextConfIndex && allConferences && allConferences.length > nextConfIndex) {
      const nextConf = allConferences[nextConfIndex + 1]
      setCurrentConference(nextConf)

      return true
    }
    return false
  }

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: VipStepIdentify.LANDING,
      component: <VipView onActions={actions} account={account} />,
    },
    {
      id: VipStepIdentify.SIGN_IN,
      component: <Signin onActions={actions} />,
    },
    {
      id: VipStepIdentify.TIMER,
      component: <VipTimer onActions={actions} startedCountdown={startedCountdown} />,
    },
    {
      id: VipStepIdentify.JOIN_WATCH_PARTY,
      component: (
        <JoinContext.Provider>
          <WatchContext.Provider>
            <MediaContext.Provider>
              <VipJoinWatchparty
                onActions={actions}
                currentConference={currentConference}
                account={account}
                joinNextConference={joinNextConference}
                currentEpisode={currentEpisode}
              />
            </MediaContext.Provider>
          </WatchContext.Provider>
        </JoinContext.Provider>
      ),
    },
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1
      if (nextStep === VipStepIdentify.SIGN_IN && cookies && cookies.account) {
        // skip sign in step if account is present
        return nextStep + 1
      }
      return nextStep
    })
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const prevStep = prevActiveStep - 1
      if (prevStep === VipStepIdentify.SIGN_IN && cookies && cookies.account) {
        // skip sign in step if account is present
        return prevStep - 1
      }
      return prevStep
    })
  }

  const actions = {
    onNextStep: handleNext,
    onBackStep: handleBack,
  }

  return (
    <Box className={classes.root}>
      <Stepper activeStep={activeStep}></Stepper>

      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        {getSteps(actions)[activeStep].component}
      </Box>
    </Box>
  )
}

export default VipSteps
