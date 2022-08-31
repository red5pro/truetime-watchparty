import { Box, Stepper } from '@mui/material'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { AccountCredentials } from '../../models/AccountCredentials'
import { Conference } from '../../models/Conference'
import { Episode } from '../../models/Episode'
import { UserAccount } from '../../models/UserAccount'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'

import { IStepActionsSubComponent } from '../../utils/commonUtils'
import Signin from '../Account/Signin/Signin'
import JoinContext from '../JoinContext/JoinContext'
import MediaContext from '../MediaContext/MediaContext'
import WatchContext from '../WatchContext/WatchContext'
import VipJoinWatchparty from './VipJoinWatchparty/VipJoinWatchparty'
import useStyles from './VipSteps.module'
import VipTimerStep from './VipTimer/VipTimerStep'
import VipView from './VipView/VipView'

enum VipStepIdentify {
  LANDING = 0,
  SIGN_IN = 1,
  TIMER = 2,
  JOIN_WATCH_PARTY = 3,
}

const VipSteps = () => {
  const [cookies] = useCookies(['userAccount', 'account'])
  const [activeStep, setActiveStep] = React.useState(0)
  const [account, setAccount] = React.useState<UserAccount>()
  const [accountCredentials, setAccountCredentials] = React.useState<AccountCredentials>()
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()
  const [allConferences, setAllConferences] = React.useState<Conference[]>()
  const [currentConference, setCurrentConference] = React.useState<Conference>()
  const [nextConference, setNextConference] = React.useState<Conference>()

  const { classes } = useStyles()

  const joinContext = React.useContext(JoinContext.Context)

  React.useEffect(() => {
    const getConferences = async (account: AccountCredentials) => {
      if (!currentConference) {
        const conf = await CONFERENCE_API_CALLS.getAllConferences(account)

        if (conf.data?.conferences && conf.status === 200) {
          const data = conf.data.conferences
          setAllConferences(data)
          setCurrentConference(currentConference ?? data[0])
        }
      }
    }

    if (cookies.account) {
      setAccountCredentials(cookies.account)
      getConferences(cookies.account)
    }

    if (cookies.userAccount) {
      setAccount(cookies.userAccount)
    }
  }, [cookies])

  React.useEffect(() => {
    if (joinContext.seriesEpisode) {
      setCurrentEpisode(joinContext.seriesEpisode.episode)
      // if (joinContext.conferenceData) {
      //   setCurrentConference(joinContext.conferenceData)
      // }
    }
  }, [joinContext.seriesEpisode])

  const joinNextConference = () => {
    const currConfIndex =
      allConferences?.findIndex((item) => item.conferenceId === currentConference?.conferenceId) || 0

    if (currConfIndex && allConferences && allConferences.length >= currConfIndex) {
      const nextConf = allConferences[currConfIndex + 1]
      setCurrentConference(nextConf)

      return true
    }
    return false
  }

  const getNextConference = () => {
    debugger
    const nextConfIndex =
      allConferences?.findIndex((item) => item.conferenceId === currentConference?.conferenceId) || 0

    if (nextConfIndex && allConferences && allConferences.length > nextConfIndex) {
      const nextConf = allConferences[nextConfIndex + 1]
      setNextConference(nextConf)

      return true
    }
    return false
  }

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: VipStepIdentify.LANDING,
      component: <VipView onActions={actions} account={accountCredentials} />,
    },
    {
      id: VipStepIdentify.SIGN_IN,
      component: <Signin onActions={actions} />,
    },
    {
      id: VipStepIdentify.TIMER,
      component: <VipTimerStep onActions={actions} startedCountdown={false} />,
    },
    {
      id: VipStepIdentify.JOIN_WATCH_PARTY,
      component: (
        <MediaContext.Provider>
          <WatchContext.Provider>
            <VipJoinWatchparty
              onActions={actions}
              account={accountCredentials}
              userAccount={account}
              getNextConference={getNextConference}
              nextConferenceToJoin={nextConference}
              currentEpisode={currentEpisode}
              currentConference={currentConference}
            />
          </WatchContext.Provider>
        </MediaContext.Provider>
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
