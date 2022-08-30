import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { Episode } from '../../../models/Episode'
import { Serie } from '../../../models/Serie'
import useStyles from './ViewEvents.module'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import ElementList from '../../Common/ElementList/ElementList'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { getCurrentEpisode } from '../../../services/conference/conference'
import { IStepActionsSubComponent } from '../../../utils/commonUtils'

interface IViewEventsProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials | null
}

const ViewEvents = (props: IViewEventsProps) => {
  const { onActions, account } = props

  const navigate = useNavigate()

  const [currentSerie, setCurrentSerie] = React.useState<Serie>()
  const [currentEpisode, setCurrentEpisode] = React.useState<Episode>()
  const [nextEpisodes, setNextEpisodes] = React.useState<Episode[]>([])

  const { classes } = useStyles()
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  const startDate = new Date(currentEpisode?.startTime ?? '')

  React.useEffect(() => {
    getCurrentEvent()
  }, [])

  const getCurrentEvent = async () => {
    const [currentEpisode, currentSerie, nextEpisodes] = await getCurrentEpisode()

    setCurrentSerie(currentSerie)
    setNextEpisodes(nextEpisodes)
    setCurrentEpisode(currentEpisode)
  }

  const onCreateAParty = () => {
    onActions.onNextStep()
  }
  const onJoinAParty = () => {
    navigate(`/join`)
  }
  return (
    <>
      {currentSerie && (
        <Box className={classes.root}>
          {/* <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
            {currentEpisode?.displayName}
          </Typography> */}
          <Box className={classes.container} display="flex" alignItems="center">
            <Box className={classes.leftContainer}>
              <Typography sx={{ fontSize: '24px' }}>{currentSerie.displayName}</Typography>
              <Typography variant="h1">{currentEpisode?.displayName}</Typography>
              <Typography
                variant="h4"
                marginTop={3}
                sx={{ fontSize: '17px', fontWeight: 600 }}
              >{`${startDate.toLocaleDateString(
                'en-US',
                dateOptions
              )} - ${startDate.getHours()}:${startDate.getMinutes()}`}</Typography>
              <Box display="flex" marginY={4} className={classes.buttonContainer}>
                <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY} onClick={onCreateAParty}>
                  Create a WatchParty
                </CustomButton>
                <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.TERTIARY} onClick={onJoinAParty}>
                  Join a WatchParty
                </CustomButton>
              </Box>
              {!account && (
                <Box display="flex">
                  <Typography sx={{ fontSize: '14px' }} mr={2}>
                    Already have a party?
                  </Typography>
                  <Link to="login" className={classes.link}>
                    Sign in
                  </Link>
                </Box>
              )}
              <Typography marginTop={4} sx={{ fontSize: '24px', fontWeight: '500' }}>
                What is a Watch Party?
              </Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
                Watch your favorite matches with friends!
              </Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: '400' }}>
                Invite your friends to come together online to enjoy your favorite sports!{' '}
              </Typography>
            </Box>
            {nextEpisodes.length > 0 && (
              <Box className={classes.rightContainer}>
                <Typography sx={{ fontWeight: 600, textAlign: 'left' }} marginBottom={2}>
                  Other events in this tournament
                </Typography>
                <ElementList items={nextEpisodes} />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

export default ViewEvents
