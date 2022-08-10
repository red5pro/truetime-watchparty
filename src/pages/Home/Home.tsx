import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { Episode } from '../../models/Episode'
import { Serie } from '../../models/Serie'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import useStyles from './Home.module'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import ElementList from '../../components/Common/ElementList/ElementList'

const Home = () => {
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
    const response = await CONFERENCE_API_CALLS.getSeriesList('email', 'password')

    if (response.data.status === 200 && response.data.series) {
      const seriesList = response.data.series

      // check this
      setCurrentSerie(seriesList[0])

      const episodeResponse = await CONFERENCE_API_CALLS.getCurrentEpisode(seriesList[0].seriesId, 'email', 'password')
      const allEpisodesResponse = await CONFERENCE_API_CALLS.getAllEpisodes(seriesList[0].seriesId, 'email', 'password')

      if (episodeResponse.data.episode && episodeResponse.data.status === 200) {
        const currentEpisode = episodeResponse.data.episode

        setCurrentEpisode(currentEpisode)
      }

      if (allEpisodesResponse.data.episodes && allEpisodesResponse.data.status === 200) {
        const allEpisodes = allEpisodesResponse.data.episodes

        if (allEpisodes.length) {
          setNextEpisodes(allEpisodes)
        }
      }
    }
  }

  const onCreateAParty = () => console.log('create a party')
  const onJoinAParty = () => console.log('join a party')

  return (
    <>
      {currentSerie && (
        <Box className={classes.root}>
          <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
            {currentEpisode?.displayName}
          </Typography>
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
              <Box display="flex">
                <Typography sx={{ fontSize: '14px' }} mr={2}>
                  Already have a party?
                </Typography>
                <Link to="" className={classes.link}>
                  Sign in
                </Link>
              </Box>
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

export default Home
