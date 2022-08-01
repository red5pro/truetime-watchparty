import { Box, Input, Typography } from '@mui/material'
import WbcLogo from '../../assets/logos/WbcLogo'
import CustomButton, { BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
// import { Link } from 'react-router-dom'
import useStyles from './Home.module'

const Home = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.container} display="flex" flexDirection="column">
      <Box width="60%" className={classes.leftContainer}>
        <WbcLogo />
        <Typography className={classes.title}>Watch Party</Typography>
        <Typography className={classes.subtitle}>Unlimited events, special guest and more.</Typography>
        <br />
        <Typography className={classes.partyCode}>Type Party Code</Typography>
        <Box display="flex">
          <Input placeholder="Party Code" />
          <CustomButton buttonType={BUTTONTYPE.PRIMARY}>Join</CustomButton>
        </Box>
        <Typography>
          Already have a party?<Box component="span">Sign in here</Box>
        </Typography>
      </Box>
      <Box width="40%"></Box>
      {/* <nav>
        <Link to="/">Home</Link> | <Link to="about">About</Link>
      </nav>

      <Link to="create">Initiate a new Conference</Link>
      <Link to="red5pro">Red 5 Event</Link> */}
    </Box>
  )
}

export default Home
