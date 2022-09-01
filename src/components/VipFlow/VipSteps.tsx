import { Box, Stepper } from '@mui/material'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import { AccountCredentials } from '../../models/AccountCredentials'
import { Conference } from '../../models/Conference'
import { Episode } from '../../models/Episode'
import { UserAccount } from '../../models/UserAccount'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'

import { IStepActionsSubComponent, UserRoles } from '../../utils/commonUtils'
import Signin from '../Account/Signin/Signin'
import JoinContext from '../JoinContext/JoinContext'
import MediaContext from '../MediaContext/MediaContext'
import Subscriber from '../Subscriber/Subscriber'
import WatchContext from '../WatchContext/WatchContext'
import VipJoinWatchparty from './VipJoinWatchparty/VipJoinWatchparty'
import VipMediaStep from './VipMediaStep/VipMediaStep'
import useStyles from './VipSteps.module'
import VipTimerStep from './VipTimer/VipTimerStep'
import VipView from './VipView/VipView'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

interface SubscriberRef {
  setVolume(value: number): any
}

enum VipStepIdentify {
  LANDING = 0,
  SIGN_IN = 1,
  AV_SETUP = 2,
  TIMER = 3,
  JOIN_WATCH_PARTY = 4,
}

const VipSteps = (props: any) => {
  const [cookies, removeCookie] = useCookies(['userAccount', 'account'])

  const mainVideoRef = React.useRef<SubscriberRef>(null)

  const [activeStep, setActiveStep] = React.useState(0)
  const [account, setAccount] = React.useState<UserAccount>()
  const [accountCredentials, setAccountCredentials] = React.useState<AccountCredentials>()
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()
  const [allConferences, setAllConferences] = React.useState<Conference[]>()
  const [currentConference, setCurrentConference] = React.useState<Conference>()
  const [nextConference, setNextConference] = React.useState<Conference>()

  const [onBoarding, setOnboarding] = React.useState<boolean>(true)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()

  const { classes } = useStyles()

  const { loading, error, seriesEpisode } = useJoinContext()
  const { mediaStream, setConstraints, setMediaStream } = useMediaContext()

  const clearMediaContext = () => {
    if (mediaStream) {
      console.log('~~CLEAR MEDIA~~')
      mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      setConstraints(undefined)
      setMediaStream(undefined)
    }
  }

  React.useEffect(() => {
    if (activeStep < VipStepIdentify.AV_SETUP) {
      clearMediaContext()
    }
  }, [activeStep])

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

    let requiresLogin = true
    if (cookies.userAccount) {
      const acc = cookies.userAccount
      const { role } = acc
      // We are dumping any previously entered account info if stored as non-VIP
      if (role !== UserRoles.VIP) {
        removeCookie('userAccount', '')
        removeCookie('account', '')
      } else {
        setAccount(cookies.userAccount)
        requiresLogin = false
      }
    } else {
      removeCookie('userAccount', '')
      removeCookie('account', '')
    }

    if (cookies.account && !requiresLogin) {
      setAccountCredentials(cookies.account)
      getConferences(cookies.account)
    }
  }, [cookies])

  React.useEffect(() => {
    if (seriesEpisode && seriesEpisode.loaded) {
      setCurrentEpisode(seriesEpisode.episode)
      // if (joinContext.conferenceData) {
      //   setCurrentConference(joinContext.conferenceData)
      // }
      const { streamGuid } = seriesEpisode.episode
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
    }
  }, [seriesEpisode])

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
      id: VipStepIdentify.AV_SETUP,
      component: <VipMediaStep onActions={actions} />,
    },
    {
      id: VipStepIdentify.TIMER,
      component: <VipTimerStep onActions={actions} startedCountdown={false} />,
    },
    {
      id: VipStepIdentify.JOIN_WATCH_PARTY,
      component: (
        <WatchContext.Provider>
          <VipJoinWatchparty
            onActions={actions}
            account={accountCredentials}
            userAccount={account}
            getNextConference={getNextConference}
            nextConferenceToJoin={nextConference}
            currentEpisode={currentEpisode}
            currentConference={currentConference}
            onCancelOnboarding={() => setOnboarding(false)}
          />
        </WatchContext.Provider>
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

  const videoStyles = { width: '100%', height: '100%', borderRadius: 'unset' }

  return (
    <Box className={classes.root}>
      <Box padding={2} className={classes.brandLogo}>
        <WbcLogoSmall />
      </Box>
      <Stepper activeStep={activeStep}></Stepper>
      {activeStep >= VipStepIdentify.TIMER && mainStreamGuid && (
        <Box className={classes.mainVideoContainer}>
          <Subscriber
            ref={mainVideoRef}
            useStreamManager={USE_STREAM_MANAGER}
            host={STREAM_HOST}
            streamGuid={mainStreamGuid}
            resubscribe={true}
            styles={videoStyles}
            videoStyles={videoStyles}
            mute={true}
            showControls={false}
          />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        height="100%"
        className={!onBoarding ? classes.watchContainer : classes.stepsContainer}
      >
        {getSteps(actions)[activeStep].component}
      </Box>
    </Box>
  )
}

export default VipSteps
