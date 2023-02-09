import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import React, { Fragment } from 'react'
import StreamListContext from '../../components/StreamListContext/StreamListContext'
import { Stream, VODStream } from '../../models/Stream'

const useStreamListContext = () => React.useContext(StreamListContext.Context)

const WatchPage = () => {
  const { data, reload } = useStreamListContext()

  const [loadingLive, setLoadingLive] = React.useState<boolean>(false)
  const [loadingVOD, setLoadingVOD] = React.useState<boolean>(false)

  React.useEffect(() => {
    setLoadingLive(data.loadingLive)
  }, data.loadingLive)

  React.useEffect(() => {
    setLoadingVOD(data.loadingVOD)
  }, [data.loadingVOD])

  return (
    <Box>
      <h1>Watch</h1>
      <Box>
        <p>Loading live: {loadingLive}</p>
        <List disablePadding>
          {data.liveStreams.map((value: Stream, i: number) => {
            return (
              <Fragment key={value.name}>
                <ListItem sx={{ margin: 3 }} disablePadding key={`${value.name}_${i}`}>
                  <ListItemButton
                    component="a"
                    href={`/watch/live?guid=${encodeURIComponent(`${value.scope}/${value.name}`)}`}
                  >
                    <ListItemText primary={value.title} />
                  </ListItemButton>
                </ListItem>
                <Divider orientation="horizontal" flexItem sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }} />
              </Fragment>
            )
          })}
        </List>
      </Box>
      <Box>
        <p>Loading vod: {loadingVOD}</p>
        <List disablePadding>
          {data.vodStreams.map((value: VODStream, i: number) => {
            return (
              <Fragment key={value.filename}>
                <ListItem sx={{ margin: 3 }} disablePadding key={`${value.filename}_${i}`}>
                  <ListItemButton component="a" href={`/watch/vod?url=${encodeURIComponent(value.url)}`}>
                    <ListItemText primary={value.title} />
                    <ListItemText primary={value.lastModified} />
                  </ListItemButton>
                </ListItem>
                <Divider orientation="horizontal" flexItem sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }} />
              </Fragment>
            )
          })}
        </List>
      </Box>
    </Box>
  )
}

export default WatchPage
