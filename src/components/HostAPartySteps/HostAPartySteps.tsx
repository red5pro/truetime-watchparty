import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Button from '@mui/material/Button'
import TemporaryHome from './TemporaryHome/TemporaryHome'
import useStyles from './HostAPartySteps.module'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import StartParty from './StartParty/StartParty'
import ViewEvents from './ViewEvents/ViewEvents'

export enum EStepIdentify {
  LANDING = 0,
  START_PARTY = 1,
  SIGN_IN = 2,
  SHARE = 3,
  JOIN_PARTY = 4,
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
  const [activeStep, setActiveStep] = React.useState(0)

  const [startPartyData, setStartPartyData] = React.useState<any>()

  const getSteps = (actions: IStepActionsSubComponent) => [
    {
      id: EStepIdentify.LANDING,
      component: <ViewEvents onActions={actions} />,
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
        />
      ),
    },
    {
      id: EStepIdentify.SIGN_IN,
      component: <TemporaryHome />,
    },
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const actions = {
    onNextStep: handleNext,
    onBackStep: handleBack,
  }

  return (
    <Box className={classes.container}>
      <Stepper activeStep={activeStep}></Stepper>

      <Box>
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
