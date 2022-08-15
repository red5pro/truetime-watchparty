import * as React from 'react'
import { Box, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'

import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './Signin.module'
import SignInEmail from './SignInEmail'
import { IStepActionsSubComponent } from '../../HostAPartySteps/HostAPartySteps'

interface ISignInProps {
  onActions?: IStepActionsSubComponent
}

const Signin = (props: ISignInProps) => {
  const { onActions } = props
  const { classes } = useStyles()

  const [signInEmail, setSignInEmail] = React.useState<boolean>(false)
  const [signInFacebook, setSignInFacebook] = React.useState<boolean>(false)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
      {!signInEmail && !signInFacebook && (
        <Box display="flex" flexDirection="column" className={classes.container}>
          <Typography className={classes.title}>Sign In</Typography>
          <Typography marginY={1}>Create an account to start hosting watchparties!</Typography>
          <CustomButton
            fullWidth
            size={BUTTONSIZE.MEDIUM}
            buttonType={BUTTONTYPE.SECONDARY}
            onClick={() => setSignInEmail(true)}
          >
            Sign In with Email
          </CustomButton>
          <Typography textAlign="center">Or</Typography>

          <CustomButton
            fullWidth
            startIcon={<FacebookIcon />}
            size={BUTTONSIZE.MEDIUM}
            buttonType={BUTTONTYPE.FACEBOOK}
            onClick={() => setSignInFacebook(true)}
          >
            Sign In with Facebook
          </CustomButton>
        </Box>
      )}
      {signInEmail && <SignInEmail onActions={onActions} />}
      {signInFacebook && <Box>Facebook</Box>}
    </Box>
  )
}

export default Signin
