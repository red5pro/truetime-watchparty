import * as React from 'react'
import { Box, Input, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import WbcLogo from '../../../assets/logos/WbcLogo'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './TemporaryHome.module'

const Home = () => {
  const { classes } = useStyles()
  const [partyCode, setPartyCode] = React.useState<string>('')

  const onInputChange = (ev: any) => setPartyCode(ev?.target?.value ?? '')

  const onClick = () => console.log(partyCode)

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
          <Input placeholder="Party Code" className={classes.input} onBlur={onInputChange} />
          <CustomButton size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.PRIMARY} onClick={onClick}>
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
            src={require('../../../assets/images/LandingPageImage.png')}
          ></img>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
