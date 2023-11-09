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
import * as React from 'react'
import { Box, Input, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import useCookies from '../../hooks/useCookies'
import WbcLogo from '../../assets/logos/WbcLogo'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../components/Common/CustomButton/CustomButton'
import useStyles from './Landing.module'
import { isWatchParty } from '../../settings/variables'
import { assetBasepath } from '../../utils/pathUtils'

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
          <Typography className={classes.title}>{isWatchParty ? 'Watch Party' : 'Webinar'}</Typography>
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
          <img
            className={classes.image}
            alt="Landing Page Image"
            src={`${assetBasepath}assets/images/LandingPageImage.png`}
          ></img>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
