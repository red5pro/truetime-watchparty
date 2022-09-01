import * as React from 'react'
import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material'
import useStyles from './VipTimer.module'

interface IVipTimerStepProps {
  startedCountdown: boolean
  finishedCountdown?: boolean
  setFinishedCountdown?: (value: boolean) => void
}

const VipTimer = (props: IVipTimerStepProps) => {
  const { startedCountdown, setFinishedCountdown, finishedCountdown = false } = props

  // TODO: Where does this limit come from?
  const [minutes, setMinutes] = React.useState<number>(30)
  const [seconds, setSeconds] = React.useState<number>(0)
  // const [progressBar, setProgressBar] = React.useState<number>(0)

  const { classes } = useStyles()

  React.useEffect(() => {
    if (startedCountdown) {
      const date = new Date()
      date.setMinutes(date.getMinutes())

      const countDownDate = date.getTime()

      const time = setInterval(() => {
        const now = new Date().getTime()
        const distance = now - countDownDate

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setMinutes(minutes)
        setSeconds(seconds)
        // setProgressBar((prevProgress: number) => (prevProgress >= 100 ? 0 : prevProgress + 0.05555))

        if (distance < 0) {
          clearInterval(time)

          if (setFinishedCountdown) {
            setFinishedCountdown(true)
          }
        }
      }, 1000)

      return () => {
        clearInterval(time)
        if (setFinishedCountdown) {
          setFinishedCountdown(true)
        }
      }
    }

    return
  }, [startedCountdown])

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.timer}>
      <CircularProgressWithLabel
        minutes={minutes}
        seconds={seconds}
        // progress={progressBar}
        finishedCountdown={finishedCountdown}
        className={classes.timer}
      />
    </Box>
  )
}

export default VipTimer

const CircularProgressWithLabel = (
  props: CircularProgressProps & { minutes: number; seconds: number; progress?: number; finishedCountdown: boolean }
) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* <CircularProgress variant="determinate" value={props.progress} {...props} /> */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="p" color="white">
          {props.finishedCountdown
            ? '0:00'
            : `${props.minutes.toLocaleString('en-US', {
                maximumSignificantDigits: 2,
                minimumIntegerDigits: 2,
              })}:${props.seconds.toLocaleString('en-US', {
                maximumSignificantDigits: 2,
                minimumIntegerDigits: 2,
              })}`}
        </Typography>
      </Box>
    </Box>
  )
}
