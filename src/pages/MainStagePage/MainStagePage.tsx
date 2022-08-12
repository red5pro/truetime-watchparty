import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import useQueryParams from '../../hooks/useQueryParams'
import MediaContext from '../../components/MediaContext/MediaContext'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import Loading from '../../components/Loading/Loading'

const MainStagePage = () => {
  const mediaContext = React.useContext(MediaContext.Context)

  const query = useQueryParams()
  const params = useParams()
  const navigate = useNavigate()

  const [conferenceId, setConferenceId] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | null>(null)

  if (!mediaContext || !mediaContext.mediaStream) {
    // TODO: Navigate back to auth?
    // TODO: If have auth context, navigate back to join?
    navigate(`/join/${params.conferenceid}?u_id=${query.get('u_id')}`)
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
    console.log('MEDIA', mediaContext?.mediaStream)
  }, [mediaContext?.mediaStream])

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

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  return (
    <>
      <p>Main Stage</p>
    </>
  )
}

export default MainStagePage
