import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Fragment } from 'react'
import { Episode } from '../../../models/Episode'
import useStyles from './ElementList.module'

interface IElementListProps {
  items: Episode[]
}

// TODO investigate https://github.com/bvaughn/react-window : React components for efficiently rendering large lists
const ElementList = (props: IElementListProps) => {
  const { items } = props

  const { classes } = useStyles()

  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }

  return (
    <List className={classes.container} disablePadding>
      {items.map((value: Episode) => {
        const date = new Date(value.startTime)
        return (
          <Fragment key={value.seriesId}>
            <ListItem disablePadding key={value.seriesId}>
              <ListItemButton className={classes.itemButton} component="a" href="#simple-list">
                <Box marginRight={2}>
                  <ListItemText primary={date.toLocaleDateString('en-US', dateOptions)} />
                  <ListItemText primary={`${date.getHours()}:${date.getMinutes()}`} />
                </Box>
                <ListItemText primary={value.displayName} className={classes.itemDisplayName} />
              </ListItemButton>
            </ListItem>
            <Divider orientation="horizontal" flexItem sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }} />
          </Fragment>
        )
      })}
    </List>
  )
}

export default ElementList
