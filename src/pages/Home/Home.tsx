import { Box, Input, Typography } from '@mui/material'
import WbcLogo from '../../assets/logos/WbcLogo'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import useStyles from './Home.module'

const Home = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.container} display="flex">
      <Box className={classes.leftContainer}>
        <WbcLogo />
        <Box className={classes.titleContainer}>
          <Typography className={classes.title}>Watch Party</Typography>
          <Typography className={classes.subtitle}>Unlimited events, special guest and more.</Typography>
        </Box>
        <Typography className={classes.partyCode}>Type Party Code</Typography>
        <Box display="flex">
          <Input placeholder="Party Code" className={classes.input} />
          <CustomButton size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.PRIMARY}>
            Join
          </CustomButton>
        </Box>
        <Box mt={4} display="flex">
          <Typography mr={2}>Already have a party?</Typography>
          <Link to="" className={classes.link}>
            Sign in here
          </Link>
        </Box>
      </Box>
      <Box className={classes.rightContainer}>
        <Box className={classes.imageContainer}>
          <img
            className={classes.image}
            alt="Landing Page Image"
            src={require('../../assets/images/LandingPageImage.png')}
          ></img>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
