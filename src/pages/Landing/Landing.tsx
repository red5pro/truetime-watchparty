import * as React from 'react'
import { Box, Input, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import WbcLogo from '../../assets/logos/WbcLogo'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import useStyles from './Landing.module'

const Home = () => {
  const { classes } = useStyles()
  const [partyCode, setPartyCode] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')

  const navigate = useNavigate()
  const { getCookies } = useCookies(['account'])

  const onInputChange = (ev: any) => {
    setPartyCode(ev?.target?.value ?? '')
    setError('')
  }

  const onClick = () => {
    if (!partyCode || partyCode.length < 19) {
      setError('Enter a valid Party Code')
      return
    }

    navigate(`/join/${partyCode}`)
  }

  const handleKeyPress = (ev: any) => {
    if (ev && ev.code === 'Enter') {
      if (!partyCode || partyCode.length < 19) {
        setError('Enter a valid Party Code')
        return
      }
      navigate(`/join/${partyCode}`)
    }
  }

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
          <Box display="flex" flexDirection="column">
            <Input
              placeholder="Party Code"
              className={`${classes.input}`}
              onBlur={onInputChange}
              onChange={onInputChange}
              onKeyPress={handleKeyPress}
            />
            {error && <Typography className={classes.errorValidation}>{error}</Typography>}
          </Box>
          <CustomButton size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.PRIMARY} onClick={onClick}>
            Join
          </CustomButton>
        </Box>
        {!getCookies()?.account && (
          <Box mt={4} display="flex">
            <Typography mr={2}>Already have a party?</Typography>

            <Link to="login?r_id=home" className={classes.link}>
              Sign in here
            </Link>
          </Box>
        )}
      </Box>
      <Box className={classes.rightContainer}>
        <Box className={classes.imageContainer}>
          <img className={classes.image} alt="Landing Page Image" src="../../assets/images/LandingPageImage.png"></img>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
