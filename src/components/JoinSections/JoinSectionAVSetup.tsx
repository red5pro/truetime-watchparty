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
import React from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import MediaSetup from '../MediaSetup/MediaSetup'

import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import MediaContext from '../MediaContext/MediaContext'

const useMediaContext = () => React.useContext(MediaContext.Context)

interface JoinSectionAVSetupProps {
  onBack?: () => void
  onJoin?: () => void
  shouldDisplayBackButton?: boolean
}

const JoinSectionAVSetup = (props: JoinSectionAVSetupProps) => {
  const { onBack, onJoin, shouldDisplayBackButton = true } = props
  // const mediaContext = React.useContext(MediaContext.Context)
  const { error, loading, mediaStream } = useMediaContext()

  const { classes } = useStyles()

  return (
    <Box className={classes.mediaSetupContainer}>
      <Typography className={classes.title}>Choose your camera and microphone preferences</Typography>
      <MediaSetup selfCleanup={false} />
      <Box className={classes.mediaSetupButtons}>
        {shouldDisplayBackButton && (
          <Button
            color="inherit"
            onClick={onBack}
            className={classes.backButton}
            sx={{ position: 'absolute', left: 0 }}
          >
            <ArrowBackIosIcon />
          </Button>
        )}
        <CustomButton
          disabled={!mediaStream || loading || error}
          size={BUTTONSIZE.MEDIUM}
          buttonType={BUTTONTYPE.SECONDARY}
          onClick={onJoin}
        >
          Join
        </CustomButton>
      </Box>
    </Box>
  )
}

export default JoinSectionAVSetup
