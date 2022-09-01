import { Box, Typography } from '@mui/material'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { isMobileScreen, IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipView.module'

interface IVipViewProps {
  onActions: IStepActionsSubComponent
  account?: AccountCredentials
  loading: boolean
}

const VipView = (props: IVipViewProps) => {
  const { loading, onActions, account } = props
  const { classes } = useStyles()

  const isMobile = isMobileScreen()

  return (
    <Box display="flex" alignItems="center">
      <Box paddingX={isMobile ? 2 : 8} display="flex" flexDirection="column" width={isMobile ? '100%' : '55%'}>
        <Typography variant="h1">
          Welcome To WBC`S <br /> Watch Parties
        </Typography>
        <Typography className={classes.text} marginY={2}>
          Watch Parties let people come together online to watch their favorite sports. You as a guest, will be
          interacting with avid fans of boxing to answer their questions, talk about yourself or just joke around!
        </Typography>
        {!loading && (
          <CustomButton onClick={onActions.onNextStep} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
            {account ? 'Join Party' : 'Sign In'}
          </CustomButton>
        )}
      </Box>
      <Box sx={{ width: '45%' }}>
        <img
          alt="Vip View Main Image"
          src={require('../../../assets/images/BoxingSession.png')}
          style={{ maxWidth: '70%' }}
        ></img>
      </Box>
    </Box>
  )
}

export default VipView
