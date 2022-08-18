import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../Common/CustomButton/CustomButton'
import useStyles from './VipView.module'

const VipView = () => {
  const { classes } = useStyles()

  return (
    <Box>
      <Typography>Welcome to WBC`S Watch Parties</Typography>
      <Typography>
        Watch Parties let people come together online to watch their favorite sports. You as a guest, will be
        interacting with avid fans of boxing to answer their questions, talk about yourself or just joke around!
      </Typography>
      <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
        <Link className={classes.link} to="/login?spg=1">
          Sign In
        </Link>
      </CustomButton>
    </Box>
  )
}

export default VipView
