import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import useQueryParams from '../../hooks/useQueryParams'
import MediaContext from '../../components/MediaContext/MediaContext'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import Loading from '../../components/Loading/Loading'
import { Box } from '@mui/system'
import useStyles from './MainStagePage.module'
import MainStage from '../../components/MainStage/MainStage'
import JoinContext from '../../components/JoinContext/JoinContext'

// TODO: Mark for Deprecation?
// MainStage Display should be accessed through Join + JoinContext?
const MainStagePage = () => {
  const joinContext = React.useContext(JoinContext.Context)
  const mediaContext = React.useContext(MediaContext.Context)

  const { classes } = useStyles()

  const query = useQueryParams()
  const params = useParams()
  const navigate = useNavigate()
  const [cookies] = useCookies(['account'])

  const [joinToken, setJoinToken] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | null>(null)

  if (!mediaContext || !mediaContext.mediaStream) {
    // TODO: Navigate back to auth?
    // TODO: If have auth context, navigate back to join?
    navigate(`/join/${params.token}?u_id=${query.get('u_id')}`)
  }

  React.useEffect(() => {
    // TODO: Ensure that if we navigate away from this page, we shut down media...
    // addEventListener('popstate', () => {
    //   clearMediaContext()
    // })
    // return () => {
    //   clearMediaContext()
    // }
  }, [])

  React.useEffect(() => {
    if (params && params.token) {
      setJoinToken(params.token)
    } else {
      setJoinToken('')
    }
  }, [params])

  React.useEffect(() => {
    if (query.get('u_id')) {
      setParticipantId(query.get('u_id')) // TODO: All users are participants. Need to find out if organizer or not.
    }
  }, [query])

  React.useEffect(() => {
    if (joinToken && participantId) {
      // TODO: Get Party/Conference info for display
      getConferenceData(joinToken, participantId)
    }
  }, [joinToken, participantId])

  React.useEffect(() => {
    if (conferenceData) {
      // TODO: Now go find out who is there already or invited?
    }
  }, [conferenceData])

  const getConferenceData = async (c_id: string, p_id: string) => {
    try {
      const details = await CONFERENCE_API_CALLS.getConferenceDetails(c_id, cookies.account)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  return (
    <Box className={classes.rootContainer}>
      {!conferenceData && <Loading />}
      {joinToken && conferenceData && <MainStage />}
    </Box>
  )
}

export default MainStagePage
