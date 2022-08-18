import * as React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import Loading from '../../components/Loading/Loading'
import useStyles from './JoinPage.module'
import { Participant } from '../../models/Participant'
import MainStagePage from '../MainStagePage/MainStagePage'

import JoinContext from '../../components/JoinContext/JoinContext'
import MediaContext from '../../components/MediaContext/MediaContext'
import JoinSectionLanding from '../../components/JoinSections/JoinSectionLanding'
import JoinSectionNicknameInput from '../../components/JoinSections/JoinSectionNicknameInput'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'
import MainStage from '../../components/MainStage/MainStage'
import useQueryParams from '../../hooks/useQueryParams'

const useJoinContext = () => React.useContext(JoinContext.Context)
const useMediaContext = () => React.useContext(MediaContext.Context)

enum Section {
  Landing = 1,
  Nickname,
  AVSetup,
  WatchParty,
}

// List up to 2, then remaining amount
const getParticipantText = (participants: Participant[] | undefined) => {
  if (!participants || participants.length === 0) {
    return 'Nobody is currently in the Watch Party.'
  }
  const maxLength = 2
  const length = participants.length
  if (length < maxLength) {
    return `${participants[0].displayName} is already here.}`
  } else if (length === maxLength) {
    return `${participants[0].displayName} and ${participants[1].displayName} are already here.`
  }
  return `${participants[0].displayName}, ${participants[1].displayName} and ${
    participants.length - maxLength
  } other(s) are already here.`
}

// Preferrably wrapped in a ParticipantContext/AuthContext with user/participant record?
const JoinPage = () => {
  const joinContext = useJoinContext()
  const mediaContext = useMediaContext()

  const { classes } = useStyles()
  const query = useQueryParams()

  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Landing)

  React.useEffect(() => {
    console.log('JOIN RENDER')
    return () => {
      console.log('JOIN OUT')
    }
  }, [])

  React.useEffect(() => {
    if (query.get('s_id')) {
      const s_id: string = query.get('s_id') as string
      const id = parseInt(s_id, 10)
      if (!isNaN(id)) {
        setCurrentSection(id)
      }
    }
  }, [query])

  React.useEffect(() => {
    if (currentSection !== Section.AVSetup && currentSection !== Section.WatchParty) {
      clearMediaContext()
    }
  }, [currentSection])

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onStartSetup = (values: any) => {
    // TODO: Store nickname... in API call? in Session Storage?
    joinContext.updateNickname(values.nickname)
    setCurrentSection(Section.AVSetup)
  }

  const onJoin = () => {
    // TODO: Define and Store media settings... in a MediaContext? in Session storage?
    // TODO: Navigate to new party page.
    // If Own Page?
    // navigate(`/main/${joinToken}`)
    setCurrentSection(Section.WatchParty)
  }

  const onReturnToLanding = () => {
    clearMediaContext()
    setCurrentSection(Section.Landing)
  }
  const onReturnToNickname = () => {
    clearMediaContext()
    setCurrentSection(Section.Nickname)
  }
  const onStartJoin = () => setCurrentSection(Section.Nickname)

  return (
    <Box className={classes.root}>
      {!joinContext.conferenceData && <Loading />}
      {joinContext.conferenceData && currentSection === Section.Landing && (
        <Box className={classes.joinSection}>
          <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 400 }}>
            Join WatchParty
          </Typography>
          <JoinSectionLanding
            seriesEpisode={joinContext.seriesEpisode}
            conferenceData={joinContext.conferenceData}
            conferenceParticipantsStringBuilder={getParticipantText}
            onStartJoin={onStartJoin}
          />
        </Box>
      )}
      {joinContext.conferenceData && currentSection === Section.Nickname && (
        <Box className={classes.joinSection}>
          <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 400 }}>
            Join WatchParty
          </Typography>
          <JoinSectionNicknameInput
            nickname={joinContext.nickname}
            seriesEpisode={joinContext.seriesEpisode}
            conferenceData={joinContext.conferenceData}
            conferenceParticipantsStringBuilder={getParticipantText}
            onBack={onReturnToLanding}
            onStartSetup={onStartSetup}
          />
        </Box>
      )}
      {joinContext.conferenceData && currentSection === Section.AVSetup && (
        <Box className={classes.joinSection}>
          <Typography paddingTop={2} sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 400 }}>
            Join WatchParty
          </Typography>
          <JoinSectionAVSetup conferenceData={joinContext.conferenceData} onBack={onReturnToNickname} onJoin={onJoin} />
        </Box>
      )}
      {joinContext.conferenceData && currentSection === Section.WatchParty && <MainStage />}
    </Box>
  )
}

export default JoinPage
