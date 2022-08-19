import * as React from 'react'
import { useCookies } from 'react-cookie'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Button from '@mui/material/Button'
import useStyles from './HostAPartySteps.module'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import StartParty from './StartParty/StartParty'
import ViewEvents from './ViewEvents/ViewEvents'
import Signin from '../Account/Signin/Signin'
import ShareLink from './ShareLink/ShareLink'
import { IConference } from '../../models/Conference'

enum EStepIdentify {
  LANDING = 0,
  SIGN_IN = 1,
  START_PARTY = 2,
  SHARE = 3,
  CHOOSE_NICKNAME = 4,
  WATCH_PARTY = 5,
}

export interface IStepActionsSubComponent {
  onNextStep: () => void
  onBackStep: () => void
}

const currentEpisodeMock = {
  episodeId: 9991,
  displayName: 'Event 1',
  startTime: 1658677171000,
  endTime: 1658691571000,
}

const currentSerieMock = {
  seriesId: 9991,
  displayName: 'Series 1',
}

export default function HostAPartySteps() {
  const { classes } = useStyles()
  const [cookies] = useCookies(['account'])

  const [activeStep, setActiveStep] = React.useState(0)
  const [startPartyData, setStartPartyData] = React.useState<IConference | undefined>()

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: EStepIdentify.LANDING,
      component: <ViewEvents onActions={actions} account={cookies?.account} />,
    },
    {
      id: EStepIdentify.SIGN_IN,
      component: <Signin onActions={actions} />,
    },
    {
      id: EStepIdentify.START_PARTY,
      component: (
        <StartParty
          onActions={actions}
          currentEpisode={currentEpisodeMock}
          currentSerie={currentSerieMock}
          data={startPartyData}
          setData={setStartPartyData}
          account={cookies?.account}
        />
      ),
    },
    {
      id: EStepIdentify.SHARE,
      component: <ShareLink account={cookies?.account} joinToken={startPartyData?.joinToken ?? ''} />,
    },
    { id: EStepIdentify.CHOOSE_NICKNAME, component: <div>Chosee Nickname</div> },
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1
      if (nextStep === EStepIdentify.SIGN_IN && cookies && cookies.account) {
        // skip sign in step if account is present
        return nextStep + 1
      }
      return nextStep
    })
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const prevStep = prevActiveStep - 1
      if (prevStep === EStepIdentify.SIGN_IN && cookies && cookies.account) {
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
        {activeStep > 0 && activeStep < getSteps(actions).length && (
          <Button color="inherit" hidden={activeStep === 0} onClick={handleBack} className={classes.backButton}>
            <ArrowBackIosIcon />
          </Button>
        )}
        {getSteps(actions)[activeStep].component}
      </Box>
    </Box>
  )
}
