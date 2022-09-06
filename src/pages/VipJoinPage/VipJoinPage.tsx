import * as React from 'react'
import { useCookies } from 'react-cookie'
import MediaContext from '../../components/MediaContext/MediaContext'
import VipSteps from '../../components/VipFlow/VipSteps'
import VipJoinContext from '../../components/VipJoinContext/VipJoinContext'
import { ConferenceDetails } from '../../models/ConferenceDetails'
import { NextVipConference } from '../../models/ConferenceStatusEvent'
import { CONFERENCE_API_CALLS } from '../../services/api/conference-api-calls'

const VipJoinPage = () => {
  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails>()

  const [nextConferenceDetails, setNextConferenceDetails] = React.useState<ConferenceDetails>()
  const [nextConferences, setNextConferences] = React.useState<NextVipConference[]>()

  const [cookies] = useCookies(['account'])

  React.useEffect(() => {
    if (cookies.account && !conferenceDetails) {
      getAllParties()
    }
  }, [cookies.account])

  const getAllParties = async () => {
    if (cookies.account) {
      // const response = await CONFERENCE_API_CALLS.getNextVipConference(cookies.account)

      const response = await CONFERENCE_API_CALLS.getVipConferenceList(cookies.account)

      // if (response.status === 200 && Object.values(response.data).length) {
      if (response.status === 200 && response.data.length) {
        const nextConfs: NextVipConference[] = response.data.filter(
          (item: NextVipConference) => item !== null && item.vipOkay && !item.vipVisited
        )
        setNextConferences(nextConfs)

        getFirstWatchParty(nextConfs)
      }
    }
  }

  const getFirstWatchParty = async (nextConfs: NextVipConference[]) => {
    const response = await getNextConference(nextConfs)

    if (response) {
      setConferenceDetails(response.confDetails)

      await getNextConference(response.nextConfList)
    }
  }

  const getNextConference = async (nextConfs: NextVipConference[]) => {
    // if (cookies.account) {
    //   // const response = await CONFERENCE_API_CALLS.getNextVipConference(cookies.account)

    //   if (response.status === 200 && Object.values(response.data).length) {
    //     const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(nextVipConf.conferenceId, cookies.account)
    //     const confLoby = await CONFERENCE_API_CALLS.getConferenceLoby(confDetails.data.joinToken)

    //     const { data } = confLoby
    //     if (data && confDetails.data) {
    //       setNextConferenceDetails(confDetails.data)
    //       setNextParticipants(data.participants)
    //     }

    //     return { confDetails: confDetails.data, participants: data.participants }
    //   }
    // }

    const nextVipConf = nextConfs[0]

    const confDetails = await CONFERENCE_API_CALLS.getConferenceDetails(
      nextVipConf.conferenceId.toString(),
      cookies.account
    )

    if (confDetails.data) {
      setNextConferenceDetails(confDetails.data)

      nextConfs.shift()

      setNextConferences(nextConfs)

      return { confDetails: confDetails.data, nextConfList: nextConfs }
    }

    return null
  }

  return (
    <VipJoinContext.Provider
      currConferenceDetails={conferenceDetails}
      nextConferences={nextConferences}
      nextConferenceDetails={nextConferenceDetails}
    >
      <MediaContext.Provider>
        <VipSteps />
      </MediaContext.Provider>
    </VipJoinContext.Provider>
  )
}

export default VipJoinPage
