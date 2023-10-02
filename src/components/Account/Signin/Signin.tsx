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
import { Box, Typography } from '@mui/material'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import SignInEmail from './SignInEmail'
import { IStepActionsSubComponent, UserRoles } from '../../../utils/commonUtils'
import WbcLogoSmall from '../../../assets/logos/WbcLogoSmall'
import SignInFacebook from './SignInFacebook'
import { isWatchParty } from '../../../settings/variables'

interface ISignInProps {
  onActions?: IStepActionsSubComponent
  emailSignin?: boolean
  facebookLoaded: boolean
  isAdminLoggingIn?: boolean
  role?: UserRoles
  redirectAfterLogin?: () => void
  validateAccount?: (account: any) => boolean
}

const Signin = (props: ISignInProps) => {
  const {
    onActions,
    emailSignin,
    role = UserRoles.ORGANIZER,
    redirectAfterLogin,
    facebookLoaded,
    validateAccount,
    isAdminLoggingIn = false,
  } = props
  const { classes } = useStyles()

  const [signInEmail, setSignInEmail] = React.useState<boolean>(emailSignin ?? false)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
      {isWatchParty && (
        <Box padding={2} className={classes.brandLogo}>
          <WbcLogoSmall />
        </Box>
      )}
      {!signInEmail && (
        <Box display="flex" flexDirection="column" className={classes.container}>
          <Typography className={classes.title}>Sign In</Typography>
          <Typography marginY={1}>
            {isAdminLoggingIn
              ? 'Login with your admin credentials'
              : `Create an account to start hosting ${isWatchParty ? 'watchparties' : 'webinars'}!`}
          </Typography>
          <CustomButton
            fullWidth
            size={BUTTONSIZE.MEDIUM}
            buttonType={BUTTONTYPE.SECONDARY}
            onClick={() => setSignInEmail(true)}
          >
            Sign In with Email
          </CustomButton>
          {facebookLoaded && (
            <>
              <Typography textAlign="center">Or</Typography>
              <SignInFacebook onActions={onActions} role={role} redirectAfterLogin={redirectAfterLogin} />
            </>
          )}
        </Box>
      )}
      {signInEmail && (
        <SignInEmail
          onActions={onActions}
          validateAccount={validateAccount}
          redirectAfterLogin={redirectAfterLogin}
          isAdminLoggingIn={isAdminLoggingIn}
        />
      )}
    </Box>
  )
}

export default Signin
