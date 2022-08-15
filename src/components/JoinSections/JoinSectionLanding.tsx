import { Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import InfoIcon from '@mui/icons-material/Info'

import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Participant } from '../../models/Participant'

interface JoinLandingProps {
  conferenceData: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onStartJoin(): any
}

const JoinSectionLanding = (props: JoinLandingProps) => {
  const { conferenceData, conferenceParticipantsStringBuilder, onStartJoin } = props

  const { classes } = useStyles()

  return (
    <Box className={classes.landingContainer}>
      <p>TODO: Episode/Series Info?</p>
      <Typography sx={{ fontSize: '24px' }}>Series 1</Typography>
      <Typography variant="h1">Event 1</Typography>
      <Box display="flex" alignItems="center" sx={{ marginTop: '24px' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>08 July - 09:00 PM</Typography>
        <Tooltip title="TODO: What is this?" arrow sx={{ marginLeft: '12px' }}>
          <InfoIcon fontSize="small" />
        </Tooltip>
      </Box>
      <Box className={classes.conferenceDetails}>
        <Typography sx={{ fontSize: '36px', fontWeight: 600 }}>{conferenceData.displayName}</Typography>
        <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>{conferenceData.welcomeMessage}</Typography>
        <Typography paddingTop={2} sx={{ fontSize: '12px', fontWeight: 500 }}>
          {conferenceParticipantsStringBuilder(conferenceData.participants)}
        </Typography>
        <CustomButton
          className={classes.landingJoin}
          size={BUTTONSIZE.MEDIUM}
          buttonType={BUTTONTYPE.SECONDARY}
          onClick={onStartJoin}
        >
          Join Party
        </CustomButton>
      </Box>
    </Box>
  )
}

export default JoinSectionLanding
