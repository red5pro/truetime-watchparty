import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import * as React from 'react'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipTimer.module'
import VipTimer from './VipTimer'

interface IVipTimerProps {
  onActions: IStepActionsSubComponent
  startedCountdown: boolean
}

const VipTimerStep = (props: IVipTimerProps) => {
  const { onActions, startedCountdown } = props

  const { classes } = useStyles()

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center">
      <Box display="flex" flexDirection="column" justifyContent="center" className={classes.container}>
        <Typography className={classes.title}>Let’s get started!</Typography>
        <Typography>This is the total time you have to visit watch parties</Typography>

        <Box marginTop={2}>
          <CustomButton onClick={onActions.onNextStep} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
            Got it!
          </CustomButton>
        </Box>
      </Box>
      <VipTimer startedCountdown={startedCountdown} />
    </Box>
  )
}

export default VipTimerStep
