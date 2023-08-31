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
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import Loading from '../../components/Common/Loading/Loading'
import useStyles from './JoinPage.module'
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
  const { loading, error, joinToken, seriesEpisode, conferenceData, nickname, updateNickname } = useJoinContext()

  const mediaContext = useMediaContext()
  const { classes } = useStyles()
  const navigate = useNavigate()

  const { getCookies, removeCookie } = useCookies(['userAccount', 'account'])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentSection, setCurrentSection] = React.useState<Section>(Section.Landing)

  React.useEffect(() => {
    const cookies = getCookies()
    if (cookies.userAccount) {
      const acc = cookies.userAccount
      const { role } = acc
      // VIPs can't join as a VIP though the main stage.
      if (role === UserRoles.VIP) {
        removeCookie('userAccount')
        removeCookie('account')
      }
    }
  }, [])

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
      {currentSection !== Section.WatchParty && (
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
      )}
      <Box display="flex" flexDirection="column" justifyContent="space-around" width="100%" height="100%">
        {!loading && conferenceData && currentSection === Section.Landing && (
          <Box className={classes.joinSection}>
            <JoinSectionLanding
              joinToken={joinToken}
              seriesEpisode={seriesEpisode}
              conferenceData={conferenceData}
              conferenceParticipantsStringBuilder={getParticipantText}
              onStartJoin={onStartJoin}
            />
          </Box>
        )}
        {!loading && conferenceData && currentSection === Section.Nickname && (
          <Box className={classes.joinSection}>
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
        {!loading && currentSection === Section.AVSetup && (
          <Box className={classes.joinSection}>
            <JoinSectionAVSetup onBack={onReturnToNickname} onJoin={onJoin} />
          </Box>
        )}
        {!loading && conferenceData && currentSection === Section.WatchParty && (
          <MainStageWithChatBox>
            <MainStageWrapper />
          </MainStageWithChatBox>
        )}

        <Box sx={{ width: '50%', position: 'absolute', right: 0, bottom: 0 }}>
          <img
            alt="Join a Party Main Image"
            src="../../assets/images/BoxMainImage.png"
            style={{
              width: '100%',
              opacity: currentSection === Section.Nickname ? 0.5 : 1,
              display: currentSection === Section.Landing || currentSection === Section.Nickname ? 'block' : 'none',
            }}
          ></img>
        </Box>

        {currentSection !== Section.WatchParty && (
          <Stack
            spacing={2}
            direction="column"
            className={classes.sponsorContainer}
            sx={currentSection === Section.AVSetup ? { alignItems: 'center', width: 'calc(100vw - 158px)' } : {}}
          >
            <Typography sx={{ fontSize: '12px' }}>Brought to you by...</Typography>
            <Stack spacing={2} direction="row">
              {/* <OracleLogo /> */}
              <Box sx={{ width: 'auto', height: '70px' }}>
                <img height="70px" alt="Logo Placeholder" src="../../assets/logos/sponsor-placeholder-2-logo.png"></img>
              </Box>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default JoinPage
