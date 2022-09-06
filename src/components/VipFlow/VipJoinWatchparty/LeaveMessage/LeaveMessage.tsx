import { Box, Typography } from '@mui/material'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../../Common/CustomButton/CustomButton'
import useStyles from './LeaveMessage.module'

const LeaveMessage = () => {
  const { classes } = useStyles()

  const partiesCount = 24
  const totalAttendeesCount = 78

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      marginLeft={2}
      className={classes.container}
    >
      <Typography className={classes.title}>Thank you for joining us today!</Typography>

      {/* TODO: COUNT NUMBERS OF PARTICIPANTS AND PARTIES JOINED */}
      {/* <Typography>{`You’ve visited ${partiesCount} parties and met ${totalAttendeesCount} attendees`}</Typography> */}

      <Box display="flex" justifyContent="space-evenly" className={classes.buttonContainer}>
        <CustomButton
          onClick={() => console.log('stay longer')}
          size={BUTTONSIZE.SMALL}
          buttonType={BUTTONTYPE.SECONDARY}
        >
          Stay Longer
        </CustomButton>
        <CustomButton onClick={() => location.reload()} size={BUTTONSIZE.SMALL} buttonType={BUTTONTYPE.TERTIARY}>
          End Participation
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LeaveMessage
