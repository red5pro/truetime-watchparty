import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import useCookies from '../../hooks/useCookies'
import useStyles from './HostAPartySteps.module'
import StartParty from './StartParty/StartParty'
import ViewEvents from './ViewEvents/ViewEvents'
import Signin from '../Account/Signin/Signin'
import ShareLink from './ShareLink/ShareLink'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { IStepActionsSubComponent, UserRoles } from '../../utils/commonUtils'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import EventContext from '../EventContext/EventContext'
import { loadFBScriptAsyncronously } from '../../utils/facebookScript'

enum EStepIdentify {
  LANDING = 0,
  SIGN_IN = 1,
  START_PARTY = 2,
  SHARE = 3,
  // CHOOSE_NICKNAME = 4,
  // WATCH_PARTY = 5,
}

export default function HostAPartySteps() {
  const { classes } = useStyles()
  const { getCookies, removeCookie } = useCookies(['account'])

  const [activeStep, setActiveStep] = React.useState(0)
  const [startPartyData, setStartPartyData] = React.useState<ConferenceDetails | undefined>()
  const [facebookLoaded, setFacebookLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setFacebookLoaded(true)
      return
    }

    loadFBScriptAsyncronously()
    document.getElementById('facebook-jssdk')?.addEventListener('load', () => setFacebookLoaded(true))
  }, [])

  const onSubmitPartyData = (data: ConferenceDetails) => {
    setStartPartyData(data)

    if (!getCookies()?.account) {
      setActiveStep(EStepIdentify.SIGN_IN)
      return false
    }
    return true
  }

  const clearCookies = () => {
    removeCookie('userAccount')
    removeCookie('account')
  }

  const validateAccount = (account: any) => {
    if (account.role === UserRoles.ORGANIZER) {
      return true
    }
    {
      clearCookies()
      return false
    }
  }

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: EStepIdentify.LANDING,
      component: <ViewEvents onActions={actions} account={getCookies().account} />,
    },
    {
      id: EStepIdentify.SIGN_IN,
      component: (
        <Signin
          onActions={actions}
          role={UserRoles.PARTICIPANT}
          facebookLoaded={facebookLoaded}
          validateAccount={validateAccount}
        />
      ),
    },
    {
      id: EStepIdentify.START_PARTY,
      component: (
        <StartParty
          onActions={actions}
          data={startPartyData}
          setData={onSubmitPartyData}
          account={getCookies().account}
        />
      ),
    },
    {
      id: EStepIdentify.SHARE,
      component: <ShareLink joinToken={startPartyData?.joinToken ?? ''} />,
    },
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1
      if (nextStep === EStepIdentify.SIGN_IN && getCookies()?.userAccount?.role === UserRoles.ORGANIZER) {
        // skip sign in step if account is present
        return nextStep + 1
      }
      return nextStep
    })
  }

  const handleBack = () => {
    debugger
    setActiveStep((prevActiveStep) => {
      const prevStep = prevActiveStep - 1
      if (prevStep === EStepIdentify.SIGN_IN && getCookies()?.userAccount?.role === UserRoles.ORGANIZER) {
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
    <Box className={classes.container}>
      <Stepper activeStep={activeStep}></Stepper>
      <Box height="100%">
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
        {activeStep > 0 && activeStep < getSteps(actions).length && (
          <Button color="inherit" hidden={activeStep === 0} onClick={handleBack} className={classes.backButton}>
            <ArrowBackIosIcon />
          </Button>
        )}
        <EventContext.Provider>{getSteps(actions)[activeStep].component}</EventContext.Provider>
      </Box>
    </Box>
  )
}
