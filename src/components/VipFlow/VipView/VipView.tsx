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
import { Box, Typography } from '@mui/material'
import { AccountCredentials } from '../../../models/AccountCredentials'
import { isMobileScreen, IStepActionsSubComponent } from '../../../utils/commonUtils'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './VipView.module'
import { assetBasepath } from '../../../utils/pathUtils'

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
          src={`${assetBasepath}assets/images/BoxingSession.png`}
          style={{ maxWidth: '70%' }}
        ></img>
      </Box>
    </Box>
  )
}

export default VipView
