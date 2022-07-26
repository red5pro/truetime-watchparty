import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
// import TestSDK from '../../components/TestSDK/TestSDK'
import VideoPreview from '../../components/VideoPreview/VideoPreview'
import useStyles from './Home.module'

const Home = () => {
  const classes = useStyles()
  return (
    <Box className={classes.classes.container}>
      <nav>
        <Link to='/'>Home</Link> | <Link to='about'>About</Link>
      </nav>
      {/* <TestSDK /> */}
      <VideoPreview />
    </Box>
  )
}

export default Home
