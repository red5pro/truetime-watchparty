import { Box, Typography } from '@mui/material'
import useStyles from './About.module'

const About = () => {
  const classes = useStyles()
  return (
    <Box className={classes.classes.container}>
      <Typography variant='h2'>About Red 5 Pro</Typography>
    </Box>
  )
}

export default About
