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
import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material'
import useStyles from './VipTimer.module'

interface IVipTimerStepProps {
  startedCountdown: boolean
  finishedCountdown?: boolean

  setFinishedCountdown?: (value: boolean) => void
  setStartedCountdown?: (value: boolean) => void
}

const VipTimer = (props: IVipTimerStepProps) => {
  const { startedCountdown, setFinishedCountdown, setStartedCountdown, finishedCountdown = false } = props

  // TODO: Where does this limit come from?
  const [minutes, setMinutes] = React.useState<number>(0)
  const [seconds, setSeconds] = React.useState<number>(0)

  const [timer, setTimer] = React.useState<NodeJS.Timer | number | any>()
  const [countDownDate, setCountDownDate] = React.useState<number>(0)

  // const [progressBar, setProgressBar] = React.useState<number>(0)

  const { classes } = useStyles()

  React.useEffect(() => {
    if (startedCountdown) {
      if (setStartedCountdown) {
        setStartedCountdown(false)
      }
      clearInterval(timer)
      const date = new Date()
      setCountDownDate(date.getTime())
    }
  }, [startedCountdown])

  React.useEffect(() => {
    if (countDownDate) {
      setTimer(
        setInterval(() => {
          const now = new Date().getTime()
          const distance = now - countDownDate

          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)

          setMinutes(minutes)
          setSeconds(seconds)
          // setProgressBar((prevProgress: number) => (prevProgress >= 100 ? 0 : prevProgress + 0.05555))

          if (distance < 0) {
            clearInterval(timer)

            if (setFinishedCountdown) {
              setFinishedCountdown(true)
            }
          }
        }, 1000)
      )
    }
  }, [countDownDate])

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
