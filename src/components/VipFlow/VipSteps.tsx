/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { Box, Stepper } from '@mui/material'
import * as React from 'react'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import { AccountCredentials } from '../../models/AccountCredentials'
import { Episode } from '../../models/Episode'
import { STREAM_HOST, USE_STREAM_MANAGER, PREFER_WHIP_WHEP } from '../../settings/variables'

import { IStepActionsSubComponent, UserRoles } from '../../utils/commonUtils'
import Loading from '../Common/Loading/Loading'
import MediaContext from '../MediaContext/MediaContext'
import SimpleAlertDialog from '../Modal/SimpleAlertDialog'
import Subscriber from '../Subscriber/Subscriber'
import VipJoinContext from '../VipJoinContext/VipJoinContext'
import WatchContext from '../WatchContext/WatchContext'
import VipJoinWatchparty from './VipJoinWatchparty/VipJoinWatchparty'
import VipMediaStep from './VipMediaStep/VipMediaStep'
import useStyles from './VipSteps.module'
import VipTimerStep from './VipTimer/VipTimerStep'
import VipView from './VipView/VipView'
import SignInEmail from '../Account/Signin/SignInEmail'
import useCookies from '../../hooks/useCookies'
import { UserAccount } from '../../models/UserAccount'

const useJoinContext = () => React.useContext(VipJoinContext.Context)
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

const VipSteps = () => {
  const mainVideoRef = React.useRef<SubscriberRef>(null)

  const [activeStep, setActiveStep] = React.useState(0)
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()

  const { getCookies } = useCookies(['userAccount', 'account'])

  const [onBoarding, setOnboarding] = React.useState<boolean>(true)
  const [mainStreamGuid, setMainStreamGuid] = React.useState<string | undefined>()

  const { classes } = useStyles()

  const { loading, error, seriesEpisode, setAccount, setLoggedIn } = useJoinContext()
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
    if (seriesEpisode && seriesEpisode.loaded) {
      setCurrentEpisode(seriesEpisode.episode)

      const { streamGuid } = seriesEpisode.episode
      if (streamGuid !== mainStreamGuid) {
        setMainStreamGuid(streamGuid)
      }
    }
  }, [seriesEpisode])

  const onMainVideoVolume = (value: number) => {
    if (mainVideoRef && mainVideoRef.current) {
      mainVideoRef.current.setVolume(value)
    }
  }

  const onRetryRequest = () => {
    window.location.reload()
  }

  const validateAccount = (userAccount: UserAccount, account: AccountCredentials) => {
    if (account && userAccount && userAccount.role === UserRoles.VIP) {
      setAccount(account)
      return true
    } else {
      return false
    }
  }

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: VipStepIdentify.LANDING,
      component: <VipView loading={loading} onActions={actions} account={getCookies().account} />,
    },
    {
      id: VipStepIdentify.SIGN_IN,
      component: <SignInEmail onActions={actions} validateAccount={validateAccount} isVipLoggingIn={true} />,
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
            currentEpisode={currentEpisode}
            onCancelOnboarding={() => setOnboarding(false)}
            onMainVideoVolume={onMainVideoVolume}
          />
        </WatchContext.Provider>
      ),
    },
  ]

  const handleNext = () => {
    const { userAccount, account } = getCookies()
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1
      if (prevActiveStep === VipStepIdentify.SIGN_IN) {
        setLoggedIn(true)
      }
      if (nextStep === VipStepIdentify.SIGN_IN && userAccount && validateAccount(userAccount, account)) {
        // skip sign in step if account is present
        return nextStep + 1
      }
      return nextStep
    })
  }

  const handleBack = () => {
    const { userAccount, account } = getCookies()
    setActiveStep((prevActiveStep) => {
      const prevStep = prevActiveStep - 1
      if (prevStep === VipStepIdentify.SIGN_IN && userAccount && validateAccount(userAccount, account)) {
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
      {loading && (
        <Box className={classes.loadingContainer}>
          <Loading text="Loading Information..." />
        </Box>
      )}
      {error && (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`${error.status ?? error.title} - ${error.statusText}`}
          confirmLabel="Retry"
          onConfirm={onRetryRequest}
        />
      )}
      {activeStep != VipStepIdentify.JOIN_WATCH_PARTY && (
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
      )}
      {/* Main Video in Background */}
      {activeStep >= VipStepIdentify.TIMER && mainStreamGuid && (
        <Box className={classes.mainVideoContainer}>
          <Subscriber
            ref={mainVideoRef}
            useStreamManager={USE_STREAM_MANAGER}
            preferWhipWhep={PREFER_WHIP_WHEP}
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
      <Stepper activeStep={activeStep}></Stepper>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        height="100%"
        className={!onBoarding ? classes.watchContainer : classes.stepsContainer}
      >
        {getSteps(actions)[activeStep].component}
      </Box>
    </Box>
  )
}

export default VipSteps
