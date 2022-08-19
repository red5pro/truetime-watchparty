import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import * as React from 'react'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipTimer.module'

interface IVipTimerProps {
  onActions: IStepActionsSubComponent
  startedCountdown: boolean
}

const VipTimer = (props: IVipTimerProps) => {
  const { onActions, startedCountdown } = props

  const [minutes, setMinutes] = React.useState<number>(0)
  const [seconds, setSeconds] = React.useState<number>(0)
  const [finishedCountdown, setFinishedCountdown] = React.useState<boolean>(false)

  const { classes } = useStyles()

  React.useEffect(() => {
    const countDownDate = new Date()
    countDownDate.setMinutes(countDownDate.getMinutes() + 30)

    const time = setInterval(() => {
      if (!finishedCountdown) {
        const now = new Date().getTime()
        const distance = now - countDownDate.getTime()

        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))

        if (distance > 0) {
          clearInterval(time)
          setFinishedCountdown(true)
        }
      }
    }, 1000)
  }, [])

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
      <Box display="flex" justifyContent="center" alignItems="center" className={classes.timer}>
        <Typography>
          {!startedCountdown && !finishedCountdown
            ? '30:00'
            : `${minutes}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`}
          {finishedCountdown && '0:00'}
        </Typography>
      </Box>
    </Box>
  )
}

export default VipTimer
