import { CircularProgress, Grid, Typography } from '@mui/material'
import React from 'react'

interface ILoadingProps {
  text?: string
}

const Loading = (props: ILoadingProps) => {
  const { text } = props
  return (
    <Grid item container alignItems="center" direction="column">
      <CircularProgress color="inherit" />
      {text && <Typography>{text}</Typography>}
    </Grid>
  )
}

export default Loading
