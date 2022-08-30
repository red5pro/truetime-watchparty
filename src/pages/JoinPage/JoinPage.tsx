import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import Loading from '../../components/Loading/Loading'
import useStyles from './JoinPage.module'
import { Participant } from '../../models/Participant'

import JoinContext from '../../components/JoinContext/JoinContext'
import MediaContext from '../../components/MediaContext/MediaContext'
import JoinSectionLanding from '../../components/JoinSections/JoinSectionLanding'
import JoinSectionNicknameInput from '../../components/JoinSections/JoinSectionNicknameInput'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'
import MainStage from '../../components/MainStage/MainStage'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import MainStageWithChatBox from '../../components/MainStageWithChatBox/MainStageWithChatBox'

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
    return `${participants[0].displayName} is already here.`
  } else if (length === maxLength) {
    return `${participants[0].displayName} and ${participants[1].displayName} are already here.`
  }
  return `${participants[0].displayName}, ${participants[1].displayName} and ${
    participants.length - maxLength
  } other(s) are already here.`
}

const JoinPage = () => {
  const { loading, error, seriesEpisode, conferenceData, nickname, updateNickname } = useJoinContext()
  const mediaContext = useMediaContext()

  const { classes } = useStyles()
  const [searchParams, setSearchParams] = useSearchParams()

  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Landing)

  React.useEffect(() => {
    if (searchParams.get('s_id')) {
      const s_id: string = searchParams.get('s_id') as string
      const id = parseInt(s_id, 10)
      if (!isNaN(id)) {
        searchParams.delete('s_id')
        setSearchParams(searchParams)
        setCurrentSection(id)
      }
    }
  }, [searchParams])

  React.useEffect(() => {
    if (currentSection !== Section.AVSetup && currentSection !== Section.WatchParty) {
      clearMediaContext()
    }
  }, [currentSection])

  const clearMediaContext = () => {
    if (mediaContext && mediaContext.mediaStream) {
      console.log('~~CLEAR MEDIA~~')
      mediaContext.mediaStream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      mediaContext.setConstraints(undefined)
      mediaContext.setMediaStream(undefined)
    }
  }

  const onStartSetup = (values: any) => {
    clearMediaContext()
    updateNickname(values.nickname)
    setCurrentSection(Section.AVSetup)
  }
  const onReturnToLanding = () => {
    clearMediaContext()
    setCurrentSection(Section.Landing)
  }
  const onReturnToNickname = () => {
    clearMediaContext()
    setCurrentSection(Section.Nickname)
  }
  const onStartJoin = () => {
    clearMediaContext()
    setCurrentSection(Section.Nickname)
  }
  const onJoin = () => {
    setCurrentSection(Section.WatchParty)
  }

  const onRetryRequest = () => {
    window.location.reload()
    return false
  }

  return (
    <Box className={classes.root}>
      {loading && <Loading />}
      {currentSection !== Section.WatchParty && (
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
      )}
      {!loading && conferenceData && currentSection === Section.Landing && (
        <Box className={classes.joinSection}>
          <Typography padding={2} className={classes.joinTitleLarge}>
            Join WatchParty
          </Typography>
          <JoinSectionLanding
            seriesEpisode={seriesEpisode}
            conferenceData={conferenceData}
            conferenceParticipantsStringBuilder={getParticipantText}
            onStartJoin={onStartJoin}
          />
        </Box>
      )}
      {!loading && conferenceData && currentSection === Section.Nickname && (
        <Box className={classes.joinSection}>
          <Typography padding={2} className={classes.joinTitleSmall}>
            Join WatchParty
          </Typography>
          <JoinSectionNicknameInput
            nickname={nickname}
            seriesEpisode={seriesEpisode}
            conferenceData={conferenceData}
            conferenceParticipantsStringBuilder={getParticipantText}
            onBack={onReturnToLanding}
            onStartSetup={onStartSetup}
          />
        </Box>
      )}
      {!loading && conferenceData && currentSection === Section.AVSetup && (
        <Box className={classes.joinSection}>
          <Typography padding={2} className={classes.joinTitleSmall}>
            Join WatchParty
          </Typography>
          <JoinSectionAVSetup conferenceData={conferenceData} onBack={onReturnToNickname} onJoin={onJoin} />
        </Box>
      )}
      {!loading && conferenceData && currentSection === Section.WatchParty && (
        <MainStageWithChatBox>
          <MainStage />
        </MainStageWithChatBox>
      )}
      {error && (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`${error.status} - ${error.statusText}`}
          confirmLabel="Retry"
          onConfirm={onRetryRequest}
        />
      )}
      <Box sx={{ width: '50%', position: 'absolute', right: 0, bottom: 0 }}>
        <img
          alt="Join a Party Main Image"
          src={require('../../assets/images/BoxMainImage.png')}
          style={{
            opacity: currentSection === Section.Nickname ? 0.5 : 1,
            display: currentSection === Section.Landing || currentSection === Section.Nickname ? 'block' : 'none',
          }}
        ></img>
      </Box>
    </Box>
  )
}

export default JoinPage
