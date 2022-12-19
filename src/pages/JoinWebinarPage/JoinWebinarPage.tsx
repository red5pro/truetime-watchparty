import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import Loading from '../../components/Common/Loading/Loading'
import useStyles from './JoinWebinarPage.module'
import { Participant } from '../../models/Participant'

import JoinContext from '../../components/JoinContext/JoinContext'
import MediaContext from '../../components/MediaContext/MediaContext'
import JoinSectionLanding from '../../components/JoinSections/JoinSectionLanding'
import JoinSectionNicknameInput from '../../components/JoinSections/JoinSectionNicknameInput'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'

import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import WbcLogoSmall from '../../assets/logos/WbcLogoSmall'
import MainStageWithChatBox from '../../components/MainStageWithChatBox/MainStageWithChatBox'
import { UserRoles } from '../../utils/commonUtils'

const WebinarMainStage = React.lazy(() => import('../../components/MainStage/WebinarMainStage'))

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

const JoinWebinarPage = () => {
  const { loading, error, joinToken, nickname, updateNickname } = useJoinContext()

  const mediaContext = useMediaContext()
  const { classes } = useStyles()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Nickname)

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

  const onCancelRequest = () => {
    navigate('/landing')
    return false
  }

  if (error) {
    return typeof error !== 'string' ? (
      <SimpleAlertDialog
        title="Something went wrong"
        message={`${error.status} - ${error.statusText}`}
        confirmLabel="Ok"
        onConfirm={onCancelRequest}
      />
    ) : (
      <Box className={classes.root}>
        <Box
          sx={{ width: '50% !important' }}
          className={classes.joinSection}
          display="flex"
          alignItems="left"
          justifyContent="center"
        >
          <Typography variant="h3">{error}</Typography>
        </Box>
      </Box>
    )
  }
  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      {loading && (
        <Box className={classes.loadingContainer}>
          <Loading text="Loading Watch Party" />
        </Box>
      )}
      {/* {currentSection !== Section.WatchParty && (
        <Box>
          <Box padding={2} className={classes.brandLogo}>
            <WbcLogoSmall />
          </Box>
          <Box>
            <Typography padding={2} className={classes.joinTitleSmall}>
              Join Watch Party
            </Typography>
          </Box>
        </Box>
      )} */}
      <Box display="flex" flexDirection="column" justifyContent="space-around" width="100%" height="100%">
        {!loading && currentSection === Section.Landing && (
          <Box className={classes.joinSection}>
            <JoinSectionLanding
              joinToken={joinToken}
              conferenceParticipantsStringBuilder={getParticipantText}
              onStartJoin={onStartJoin}
            />
          </Box>
        )}
        {!loading && currentSection === Section.Nickname && (
          <Box className={classes.joinSection}>
            <JoinSectionNicknameInput
              nickname={nickname}
              conferenceParticipantsStringBuilder={getParticipantText}
              onStartSetup={onStartSetup}
            />
          </Box>
        )}
        {!loading && currentSection === Section.AVSetup && (
          <Box className={classes.joinSection}>
            <JoinSectionAVSetup onBack={onReturnToNickname} onJoin={onJoin} />
          </Box>
        )}
        {!loading && currentSection === Section.WatchParty && (
          <MainStageWithChatBox>
            <WebinarMainStage />
          </MainStageWithChatBox>
        )}
      </Box>
    </Box>
  )
}

export default JoinWebinarPage
