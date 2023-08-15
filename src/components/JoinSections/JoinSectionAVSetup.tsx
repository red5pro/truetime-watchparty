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
  conferenceData?: ConferenceDetails
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
