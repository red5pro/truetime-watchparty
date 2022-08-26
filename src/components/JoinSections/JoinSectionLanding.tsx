import React from 'react'
import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import InfoIcon from '@mui/icons-material/Info'
import useStyles from './JoinSections.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Participant } from '../../models/Participant'
import { getStartTimeFromTimestamp } from '../../utils/commonUtils'
import SignInModal from '../Modal/SignInModal'
import { useCookies } from 'react-cookie'

interface JoinLandingProps {
  seriesEpisode: any
  conferenceData: ConferenceDetails
  conferenceParticipantsStringBuilder(participants: Participant[]): string
  onStartJoin(): any
}

const JoinSectionLanding = (props: JoinLandingProps) => {
  const { seriesEpisode, conferenceData, conferenceParticipantsStringBuilder, onStartJoin } = props
  const [showLogin, setShowLogin] = React.useState<boolean>(false)

  const { classes } = useStyles()
  const [cookies, setCookie] = useCookies(['account'])

  const onHostLogin = () => {
    setShowLogin(true)
  }

  const hideLogin = (account?: any) => {
    setShowLogin(false)
    if (account && account.email && account.password) {
      onStartJoin()
    }
  }

  return (
    <Box className={classes.landingContainer}>
      <Typography sx={{ fontSize: '24px' }}>{seriesEpisode.series.displayName}</Typography>
      <Typography variant="h1">{seriesEpisode.episode.displayName}</Typography>
      <Box display="flex" alignItems="center" sx={{ marginTop: '24px' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
          {getStartTimeFromTimestamp(seriesEpisode.episode.startTime)}
        </Typography>
        <Tooltip title="Additional Information..." arrow sx={{ marginLeft: '12px' }}>
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
          {!cookies?.account && (
            <Button variant="text" className={classes.link} onClick={onHostLogin}>
              Are you the host?
            </Button>
          )}
        </Box>
      </Box>
      <SignInModal open={showLogin} onDismiss={hideLogin} />
    </Box>
  )
}

export default JoinSectionLanding
