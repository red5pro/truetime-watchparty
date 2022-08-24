import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import InfoIcon from '@mui/icons-material/Info'

import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Participant } from '../../models/Participant'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'
import LayoutIconEmpty from '../Common/MainStageLayoutIcon/LayoutIconEmpty'
import LayoutIconStage from '../Common/MainStageLayoutIcon/LayoutIconStage'
import LayoutIconFullscreen from '../Common/MainStageLayoutIcon/LayoutIconFullscreen'
import MainStageLayoutSelect from '../MainStageLayoutSelect/MainStageLayoutSelect'

interface JoinLandingProps {
  seriesEpisode: any
  conferenceData: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onStartJoin(): any
}

const JoinSectionLanding = (props: JoinLandingProps) => {
  const { seriesEpisode, conferenceData, conferenceParticipantsStringBuilder, onStartJoin } = props

  const { classes } = useStyles()

  const onHostLogin = () => {
    // TODO: Show login modal?
  }

  return (
    <Box className={classes.landingContainer}>
      <Typography sx={{ fontSize: '24px' }}>{seriesEpisode.series.displayName}</Typography>
      <Typography variant="h1">{seriesEpisode.episode.displayName}</Typography>
      <Box display="flex" alignItems="center" sx={{ marginTop: '24px' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
          {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
        </Typography>
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
        <Box className={classes.joinControls}>
          <CustomButton
            className={classes.landingJoin}
            size={BUTTONSIZE.MEDIUM}
            buttonType={BUTTONTYPE.SECONDARY}
            onClick={onStartJoin}
          >
            Join Party
          </CustomButton>
          <Button variant="text" className={classes.link} onClick={onHostLogin}>
            Are you the host?
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default JoinSectionLanding
