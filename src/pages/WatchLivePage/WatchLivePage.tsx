import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import Loading from '../../components/Common/Loading/Loading'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import Subscriber from '../../components/Subscriber/Subscriber'
import useQueryParams from '../../hooks/useQueryParams'

const WatchLivePage = () => {
  const query = useQueryParams()
  const navigate = useNavigate()

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
    <Box>
      {!streamGuid && (
        <Stack direction="column" alignContent="center" spacing={2}>
          <Loading />
          <Typography>Loading Live Stream...</Typography>
        </Stack>
      )}
      {streamGuid && (
        <Subscriber
          host={STREAM_HOST}
          useStreamManager={USE_STREAM_MANAGER}
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
