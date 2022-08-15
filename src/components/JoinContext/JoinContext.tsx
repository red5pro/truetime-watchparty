import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'

interface JoinContextProps {
  children: any
}

const JoinContext = React.createContext<any>(null)

const JoinProvider = (props: JoinContextProps) => {
  const { children } = props

  const query = useQueryParams()
  const params = useParams()
  const navigate = useNavigate()

  const [joinToken, setJoinToken] = React.useState<string | null>(null)
  const [participantId, setParticipantId] = React.useState<string | null>(null)

  const [nickname, setNickname] = React.useState<string | undefined>('larry') // TODO: get from participant context or session storage?
  // ConferenceDetails access from the server API.
  const [conferenceData, setConferenceData] = React.useState<ConferenceDetails | undefined>()

  React.useEffect(() => {
    if (params && params.token) {
      setJoinToken(params.token)
    } else {
      navigate('/')
    }
  }, [params])

  React.useEffect(() => {
    if (query.get('u_id')) {
      setParticipantId(query.get('u_id')) // TODO: All users are participants. Need to find out if organizer or not.
    }
  }, [query])

  React.useEffect(() => {
    if (joinToken && participantId) {
      getConferenceData(joinToken)
    }
  }, [joinToken, participantId])

  const getConferenceData = async (token: string) => {
    try {
      const details = await CONFERENCE_API_CALLS.getJoinDetails(token)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  const exportedValues = {
    nickname,
    joinToken,
    conferenceData,
    setNickname,
  }

  return <JoinContext.Provider value={exportedValues}>{children}</JoinContext.Provider>
}

export default {
  Context: JoinContext,
  Consumer: JoinContext.Consumer,
  Provider: JoinProvider,
}
