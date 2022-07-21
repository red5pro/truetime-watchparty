import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import useStyles from './Home.module'

const Home = () => {
  const classes = useStyles()
  return (
    <Box className={classes.classes.container}>
      <nav>
        <Link to="/">Home</Link> | <Link to="about">About</Link>
      </nav>

      <Link to="create">Initiate a new Conference</Link>
      <Link to="red5pro">Red 5 Event</Link>
    </Box>
  )
}

export default Home
