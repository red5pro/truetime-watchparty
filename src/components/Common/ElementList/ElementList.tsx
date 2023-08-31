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
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Fragment } from 'react'
import { Episode } from '../../../models/Episode'
import moment from 'moment'
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
            <ListItem sx={{ margin: 3 }} disablePadding key={value.seriesId}>
              {/* <ListItemButton className={classes.itemButton} component="a" href="#simple-list"> */}
              <Box marginRight={2}>
                <ListItemText sx={{ whiteSpace: 'nowrap' }} primary={date.toLocaleDateString('en-US', dateOptions)} />
                <ListItemText primary={`${moment(date).format('HH:mm')}`} />
              </Box>
              <ListItemText primary={value.displayName} className={classes.itemDisplayName} />
              {/* </ListItemButton> */}
            </ListItem>
            <Divider orientation="horizontal" flexItem sx={{ width: '100%', bgcolor: '#d3d3d3', height: '1px' }} />
          </Fragment>
        )
      })}
    </List>
  )
}

export default ElementList
