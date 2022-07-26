import { Box, Typography } from '@mui/material'

const SubscriptionStatus = () => {
  return (
    <Box component="div">
      <Typography>{`Bitrate: `}</Typography>
      <Typography>{`Packets Sent: `}</Typography>
      <Typography>{`Resolution: `}</Typography>
    </Box>
  )
}

export default SubscriptionStatus
