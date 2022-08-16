import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'
import { SessionStorage } from '../../utils/sessionStorageUtils'

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

  const [nickname, setNickname] = React.useState<string | undefined>(SessionStorage.get('wp_nickname' || undefined)) // TODO: get from participant context or session storage?
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
    if (joinToken) {
      getConferenceData(joinToken)
    }
  }, [joinToken])

  const getConferenceData = async (token: string) => {
    try {
      const details = await CONFERENCE_API_CALLS.getJoinDetails(token)
      setConferenceData(details.data)
    } catch (e) {
      // TODO: Display alert
      console.error(e)
    }
  }

  // Returns stream guid (context + name) of the current participant to broadcast on.
  const getStreamGuid = () => {
    // TODO: Strip special characters.
    return `live/${joinToken}_${nickname}`
  }

  const exportedValues = {
    nickname,
    joinToken,
    conferenceData,
    updateNickname: (value: string) => {
      setNickname(value)
      SessionStorage.set('wp_nickname', value)
    },
    getStreamGuid,
  }

  return <JoinContext.Provider value={exportedValues}>{children}</JoinContext.Provider>
}

export default {
  Context: JoinContext,
  Consumer: JoinContext.Consumer,
  Provider: JoinProvider,
}
