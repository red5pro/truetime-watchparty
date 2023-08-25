import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import Loading from '../../components/Common/Loading/Loading'
import { STREAM_HOST, USE_STREAM_MANAGER, PREFER_WHIP_WHEP } from '../../settings/variables'
import Subscriber from '../../components/Subscriber/Subscriber'
import useQueryParams from '../../hooks/useQueryParams'
import useStyles from '../WatchPage/WatchPage.module'

const WatchLivePage = () => {
  const query = useQueryParams()
  const navigate = useNavigate()

  const { classes } = useStyles()

  const [streamGuid, setStreamGuid] = React.useState<string>()

  React.useEffect(() => {
    if (query.get('guid')) {
      try {
        const guid = decodeURIComponent(query.get('guid') as string)
        setStreamGuid(guid)
      } catch (e) {
        console.error(e)
        navigate('/watch')
      }
    } else {
      navigate('/watch')
    }
  }, [query])

  const onSubscribeStart = () => {
    // nada?
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      {!streamGuid && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading Live Stream...</Typography>
        </Stack>
      )}
      {streamGuid && (
        <Subscriber
          host={STREAM_HOST}
          useStreamManager={USE_STREAM_MANAGER}
          preferWhipWhep={PREFER_WHIP_WHEP}
          mute={false}
          showControls={true}
          streamGuid={streamGuid}
          resubscribe={true}
          styles={{ width: '100vw', height: '100vh' }}
          videoStyles={{ width: '100vw', height: '100vh', objectFit: 'contain' }}
          isAudioOff={false}
          isVideoOff={false}
          onSubscribeStart={onSubscribeStart}
        />
      )}
    </Box>
  )
}

export default WatchLivePage
