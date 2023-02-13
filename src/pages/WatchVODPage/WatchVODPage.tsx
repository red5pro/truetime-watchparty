import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import useQueryParams from '../../hooks/useQueryParams'
import useStyles from '../WatchPage/WatchPage.module'
import Hls from 'hls.js'
import SimpleAlertDialog from '../../components/Modal/SimpleAlertDialog'
import Loading from '../../components/Common/Loading/Loading'

const mp4Reg = /.*\.mp4/gi

const WatchVODPage = () => {
  const query = useQueryParams()
  const navigate = useNavigate()

  const { classes } = useStyles()

  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [isMP4, setIsMP4] = React.useState<boolean>(false)
  const [noMSESupport, setNoMSESupport] = React.useState<boolean>(false)
  const [streamUrl, setStreamUrl] = React.useState<string>()
  const [requiresSwapOnError, setRequiresSwapOnError] = React.useState<boolean>(true)

  const [error, setError] = React.useState<string | null>(null)
  const [playbackPaused, setPlaybackPaused] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (query.get('url')) {
      if (!streamUrl) {
        try {
          let url = decodeURIComponent(query.get('url') as string)
          // Debugging. Load Big Buck Bunny for CORS.
          // const debug = 'vid_bigbuckbunny.mp4'
          // const debug = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          const debug = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
          url = /^http:/.exec(url) ? debug : url
          setStreamUrl(url)
        } catch (e) {
          console.error(e)
          navigate('/watch')
        }
      }
    } else {
      navigate('/watch')
    }
  }, [query])

  React.useEffect(() => {
    if (streamUrl && videoRef.current) {
      const loadAsMP4 = !!mp4Reg.exec(streamUrl)
      if (!loadAsMP4 && Hls.isSupported()) {
        const hls = new Hls()
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          // console.log('video and hls.js are now bound together !')
        })
        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          // console.log(`Video Element is paused? ${(videoRef.current as HTMLMediaElement).paused}`)
          try {
            await videoRef.current?.play()
          } catch (e) {
            console.error(e)
            // Most likely not started from User interaction
            setPlaybackPaused(true)
          }
        })
        hls.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (requiresSwapOnError) {
                  hls.swapAudioCodec()
                  setRequiresSwapOnError(false)
                } else {
                  hls.recoverMediaError()
                  setRequiresSwapOnError(true)
                }
                break
              default:
                setError('Could not load HLS video source.')
                break
            }
          }
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(videoRef.current)
      } else if (loadAsMP4) {
        setIsMP4(loadAsMP4)
      } else {
        setNoMSESupport(true)
      }
    }
  }, [isMP4, streamUrl])

  const onConfirmPausedPlayback = async () => {
    setPlaybackPaused(false)
    try {
      await videoRef.current?.play()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      {!streamUrl && (
        <Stack direction="column" alignContent="center" spacing={2} className={classes.loadingContainer}>
          <Loading />
          <Typography>Loading VOD Stream...</Typography>
        </Stack>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        {streamUrl && isMP4 && <source src={streamUrl} type="video/mp4"></source>}
        {streamUrl && noMSESupport && <source src={streamUrl} type="application/x-mpegURL"></source>}
      </video>
      {playbackPaused && (
        <SimpleAlertDialog
          title="Playback May Be Paused"
          message="Auto Playback may have been paused as the browser requires your explicit interaction."
          confirmLabel="Ok"
          onConfirm={() => {
            onConfirmPausedPlayback()
          }}
        />
      )}
      {error && (
        <SimpleAlertDialog
          title="Playback Could Not Start"
          message={error}
          confirmLabel="Ok"
          onConfirm={() => setError(null)}
        />
      )}
    </Box>
  )
}

export default WatchVODPage
