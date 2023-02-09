import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import Loading from '../../components/Common/Loading/Loading'
import { STREAM_HOST, USE_STREAM_MANAGER } from '../../settings/variables'
import useQueryParams from '../../hooks/useQueryParams'

const WatchVODPage = () => {
  const query = useQueryParams()
  const navigate = useNavigate()

  const [streamUrl, setStreamUrl] = React.useState<string>()

  React.useEffect(() => {
    if (query.get('url')) {
      try {
        const url = decodeURIComponent(query.get('url') as string)
        setStreamUrl(url)
      } catch (e) {
        console.error(e)
        navigate('/watch')
      }
    } else {
      navigate('/watch')
    }
  }, [query])

  return <p>Watch VOD</p>
}

export default WatchVODPage
