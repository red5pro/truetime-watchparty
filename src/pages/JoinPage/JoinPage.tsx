import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import Loading from '../../components/Loading/Loading'
import useQueryParams from '../../hooks/useQueryParams'
import useStyles from './JoinPage.module'
import { ConferenceDetails } from '../../models/ConferenceDetails'

const JoinPage = () => {
  const { classes } = useStyles()
  const query = useQueryParams()
  const params = useParams()

  const [conferenceId, setConferenceId] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | null>(null)

  React.useEffect(() => {
    if (params && params.conferenceid) {
      setConferenceId(params.conferenceid)
    } else {
      setConferenceId('')
    }
  }, [params])

  React.useEffect(() => {
    if (query.get('u_id')) {
      setParticipantId(query.get('u_id')) // TODO: All users are participants. Need to find out if organizer or not.
    }
  }, [query])

  React.useEffect(() => {
    if (conferenceId && participantId) {
      // TODO: Get Party/Conference info for display
      getConferenceData(conferenceId, participantId)
    }
  }, [conferenceId, participantId])

  React.useEffect(() => {
    if (conferenceData) {
      // TODO: Now go find out who is there already or invited?
    }
  }, [conferenceData])

  const getConferenceData = async (c_id: string, p_id: string) => {
    try {
      // TODO: Get credentials from somewhere?
      const username = 'user'
      const password = 'pass'
      const details = await CONFERENCE_API_CALLS.getConferenceDetails(c_id, username, password)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  return (
    <>
      <Box className={classes.root}>
        <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px' }}>
          Join WatchParty
        </Typography>
        {!conferenceData && <Loading />}
        {conferenceData && (
          <>
            <p>TODO: Episode/Series Info?</p>
            <p>{conferenceData.displayName}</p>
            <p>{conferenceData.welcomeMessage}</p>
            <p>TODO: Participant listing...</p>
            <button>Join Party</button>
          </>
        )}
      </Box>
    </>
  )
}

export default JoinPage
