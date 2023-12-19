/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Loading from '../../components/Common/Loading/Loading'
import useStyles from './JoinWebinarPage.module'
import { Participant } from '../../models/Participant'

import JoinContext from '../../components/JoinContext/JoinContext'
import MediaContext from '../../components/MediaContext/MediaContext'
import JoinSectionLanding from '../../components/JoinSections/JoinSectionLanding'
import JoinSectionNicknameInput from '../../components/JoinSections/JoinSectionNicknameInput'
import JoinSectionAVSetup from '../../components/JoinSections/JoinSectionAVSetup'

import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import MainStageWithChatBox from '../../components/MainStageWithChatBox/MainStageWithChatBox'
import useCookies from '../../hooks/useCookies'
import { UserRoles } from '../../utils/commonUtils'
import { isWatchParty } from '../../settings/variables'

const MainStageWrapper = React.lazy(() => import('../../components/MainStage/MainStageWrapper'))

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
    return `Nobody is currently in the ${isWatchParty ? 'Watch Party' : 'Webinar'}.`
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
  const {
    loading,
    error,
    joinToken,
    nickname,
    updateNickname,
    isMixerParticipant,
    isAnonymousParticipant,
    isChatEnabled,
  } = useJoinContext()

  const mediaContext = useMediaContext()
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { getCookies } = useCookies(['userAccount'])

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
    if (joinToken && searchParams.get('cohost')) {
      const { userAccount } = getCookies()
      if (!userAccount || userAccount.role !== UserRoles.ORGANIZER) {
        navigate(`/login?r_id=join/${joinToken}`)
      }
    }
  }, [searchParams, joinToken])

  React.useEffect(() => {
    if (isAnonymousParticipant && currentSection !== Section.WatchParty) {
      setCurrentSection(Section.WatchParty)
    }
  }, [isAnonymousParticipant, currentSection])

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
          <Loading text="Loading Webinar" />
        </Box>
      )}
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
        {!loading && currentSection === Section.WatchParty && isMixerParticipant && (
          // <MainStageWithChatBox>
          <MainStageWrapper />
          // </MainStageWithChatBox>
        )}
        {!loading && currentSection === Section.WatchParty && !isMixerParticipant && isChatEnabled && (
          <MainStageWithChatBox>
            <MainStageWrapper />
          </MainStageWithChatBox>
        )}
        {!loading && currentSection === Section.WatchParty && !isMixerParticipant && !isChatEnabled && (
          <React.Suspense fallback={<Loading />}>
            <MainStageWrapper />
          </React.Suspense>
        )}
      </Box>
    </Box>
  )
}

export default JoinWebinarPage
