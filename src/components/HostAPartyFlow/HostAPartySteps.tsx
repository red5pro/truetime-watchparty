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
import { useLoadScript } from '../../hooks/useLoadScript'
import { isWatchParty } from '../../settings/variables'

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
  const { getCookies, removeCookie } = useCookies(['account', 'userAccount'])

  const [activeStep, setActiveStep] = React.useState(0)
  const [startPartyData, setStartPartyData] = React.useState<ConferenceDetails | undefined>()

  const facebookLoaded = useLoadScript()

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
          role={UserRoles.ORGANIZER}
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
        {isWatchParty && (
          <Box padding={2} className={classes.brandLogo}>
            <WbcLogoSmall />
          </Box>
        )}
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
