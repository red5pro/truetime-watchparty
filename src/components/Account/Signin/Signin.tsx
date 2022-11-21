import * as React from 'react'
import { Box, Typography } from '@mui/material'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import SignInEmail from './SignInEmail'
import { IStepActionsSubComponent, UserRoles } from '../../../utils/commonUtils'
import WbcLogoSmall from '../../../assets/logos/WbcLogoSmall'
import Red5ProLogoSmall from '../../../assets/logos/Red5ProLogoSmall'
import SignInFacebook from './SignInFacebook'

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
      <Box padding={2} className={classes.brandLogo}>
        <Red5ProLogoSmall />
      </Box>
      {!signInEmail && (
        <Box display="flex" flexDirection="column" className={classes.container}>
          <Typography className={classes.title}>Sign In</Typography>
          <Typography marginY={1}>
            {isAdminLoggingIn
              ? 'Login with your admin credentials'
              : 'Create an account to start hosting watchparties!'}
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
