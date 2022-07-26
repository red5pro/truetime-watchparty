import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import useStyles from './Home.module'

const Home = () => {
  const classes = useStyles()
  return (
    <Box className={classes.classes.container}>
      <nav>
        <Link to="/">Home</Link> | <Link to="about">About</Link>
      </nav>
      <Typography>Initiate a new Conference</Typography>
      {/* <VideoPreview onJoinRoom={() => console.log('join')} /> */}
    </Box>
  )
}

export default Home
