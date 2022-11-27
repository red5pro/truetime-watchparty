import { Box } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props

  return (
    <Box
      component="div"
      width="100%"
      role="tabpanel"
      id={index.toString()}
      aria-labelledby={index.toString()}
      {...other}
      sx={{ p: 3 }}
    >
      {children}
    </Box>
  )
}

export default TabPanel
