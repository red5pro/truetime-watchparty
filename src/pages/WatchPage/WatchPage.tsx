import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import React, { Fragment } from 'react'
import { classnames } from 'tss-react/tools/classnames'
import Loading from '../../components/Common/Loading/Loading'
import StreamListContext from '../../components/StreamListContext/StreamListContext'
import { Stream, VODStream } from '../../models/Stream'
import useStyles from './WatchPage.module'

const useStreamListContext = () => React.useContext(StreamListContext.Context)
const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }

const WatchPage = () => {
  const { data, reload } = useStreamListContext()

  const { classes } = useStyles()

  const [interval, setInt] = React.useState<NodeJS.Timer>()
  const [loadingLive, setLoadingLive] = React.useState<boolean>(false)
  const [loadingVOD, setLoadingVOD] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!interval) {
      // Every 5 minutes
      setInt(setInterval(async () => await reload(), 5 * 60 * 1000))
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  React.useEffect(() => {
    setLoadingLive(data.loadingLive)
  }, [data.loadingLive])

  React.useEffect(() => {
    setLoadingVOD(data.loadingVOD)
  }, [data.loadingVOD])

  return (
    <Box className={classes.rootContainer}>
      <Typography variant="h2" className={classes.title}>
        Available Webinars
      </Typography>
      <Box className={classes.listsGrid}>
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-around">
            <Typography variant="h4">Currently Live</Typography>
            {/* <Loading text="Reloading" /> */}
            {loadingLive && <CircularProgress color="inherit" size={20} />}
          </Stack>
          <List disablePadding className={classes.listContainer}>
            {data.liveStreams.length === 0 && <Typography>No Live Events Found.</Typography>}
            {data.liveStreams.map((value: Stream, i: number) => {
              return (
                <Fragment key={value.name}>
                  <ListItem disablePadding key={`${value.name}_${i}`}>
                    <ListItemButton
                      component="a"
                      href={`/watch/live?guid=${encodeURIComponent(`${value.scope}/${value.name}`)}`}
                    >
                      <ListItemText primary={value.title} />
                    </ListItemButton>
                  </ListItem>
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }}
                  />
                </Fragment>
              )
            })}
          </List>
        </Stack>
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-around">
            <Typography variant="h4">Previously Recorded</Typography>
            {/* <Loading text="Reloading" /> */}
            {loadingVOD && <CircularProgress color="inherit" size={20} />}
          </Stack>
          <List disablePadding className={classes.listContainer}>
            {data.vodStreams.length === 0 && <Typography>No VOD Events Found.</Typography>}
            {data.vodStreams.map((value: VODStream, i: number) => {
              const date = new Date(value.lastModified)
              const dateStr = date.toLocaleDateString('en-US', dateOptions)
              const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
              return (
                <Fragment key={value.filename}>
                  <ListItem disablePadding key={`${value.filename}_${i}`}>
                    <ListItemButton
                      component="a"
                      href={`/watch/vod?url=${encodeURIComponent(value.fullUrl || value.url)}`}
                    >
                      <ListItemText primary={value.title} />
                      <ListItemText
                        primary={`Ended: ${dateStr} ${timeStr}`}
                        sx={{ textAlign: 'right', whiteSpace: 'nowrap', marginRight: '5px' }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }}
                  />
                </Fragment>
              )
            })}
          </List>
        </Stack>
      </Box>
    </Box>
  )
}

export default WatchPage
