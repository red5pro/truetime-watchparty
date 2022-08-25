import { Box, Typography } from '@mui/material'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { isMobileScreen, IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipView.module'

interface IVipViewProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials
}

const VipView = (props: IVipViewProps) => {
  const { onActions, account } = props
  const { classes } = useStyles()

  const isMobile = isMobileScreen()

  return (
    <Box paddingX={isMobile ? 2 : 8} display="flex" flexDirection="column" width={isMobile ? '100%' : '65%'}>
      <Typography variant="h1">
        Welcome To WBC`S <br /> Watch Parties
      </Typography>
      <Typography className={classes.text} marginY={2}>
        Watch Parties let people come together online to watch their favorite sports. You as a guest, will be
        interacting with avid fans of boxing to answer their questions, talk about yourself or just joke around!
      </Typography>
      {/* <Link className={classes.link} to="/login?spg=1"> */}
      <CustomButton onClick={onActions.onNextStep} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
        {account ? 'Join Party' : 'Sign In'}
      </CustomButton>
      {/* </Link> */}
    </Box>
  )
}

export default VipView
