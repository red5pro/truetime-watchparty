import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { ConferenceDetails } from '../../../models/ConferenceDetails'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import SetupPartyForm from './SetupPartyForm'
import useStyles from './StartParty.module'

interface IStartPartyProps {
  onActions: IStepActionsSubComponent
  data?: ConferenceDetails
  setData: (values: ConferenceDetails) => void
  currentEpisode: any
  currentSerie: any
  account: AccountCredentials
}

const StartParty = (props: IStartPartyProps) => {
  const { onActions, currentEpisode, currentSerie, data, setData, account } = props

  const { classes } = useStyles()
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  const startDate = new Date(currentEpisode?.startTime ?? '')

  return (
    <Box className={classes.root}>
      <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
        {currentEpisode?.displayName}
      </Typography>
      <Box className={classes.container} display="flex" flexDirection="column">
        <Typography sx={{ fontSize: '24px' }}>{currentSerie.displayName}</Typography>
        <Typography variant="h1">{currentEpisode?.displayName}</Typography>
        <Typography
          variant="h4"
          marginY={3}
          sx={{ fontSize: '17px', fontWeight: 600 }}
        >{`${startDate.toLocaleDateString(
          'en-US',
          dateOptions
        )} - ${startDate.getHours()}:${startDate.getMinutes()}`}</Typography>

        <Box display="flex">
          <Typography marginRight={2}>Set up your party</Typography>

          {!account && (
            <Link to="login" className={classes.link}>
              Returning host?
            </Link>
          )}
        </Box>
        <SetupPartyForm onActions={onActions} data={data} setData={setData} account={account} />
      </Box>
    </Box>
  )
}

export default StartParty
