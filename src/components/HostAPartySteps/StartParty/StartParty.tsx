import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { IStepActionsSubComponent } from '../HostAPartySteps'
import SetupPartyForm, { IPartyData } from './SetupPartyForm'
import useStyles from './StartParty.module'

interface IStartPartyProps {
  onActions: IStepActionsSubComponent
  data?: IPartyData
  setData: (values: IPartyData) => void
  currentEpisode: any
  currentSerie: any
}

const StartParty = (props: IStartPartyProps) => {
  const { onActions, currentEpisode, currentSerie, data, setData } = props

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

          {/* TODO: IF USER IS LOGGED IN, DO NOT DISPLAY THIS ? */}
          <Link to="" className={classes.link}>
            Returning host?
          </Link>
        </Box>
        <SetupPartyForm onActions={onActions} data={data} setData={setData} />
      </Box>
    </Box>
  )
}

export default StartParty
