import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'

interface ICountryListProps {
  countries: { country: string; count: number }[]
}
const CountryList = ({ countries }: ICountryListProps) => {
  return (
    <Box component="div" margin="1rem 0 0 2rem" width="16%" height="fit-content">
      <Typography color="rgba(152, 152, 152, 0.6)" fontWeight={600} marginY={1}>
        Conferences by Country
      </Typography>
      <List sx={{ maxHeight: ' 175px', overflow: 'auto' }}>
        {countries.map((value) => (
          <ListItem key={value.country} disablePadding>
            <ListItemText id={value.country} primary={value.country} />
            <ListItemText
              id={value.country}
              sx={{ textAlign: 'center', flex: 0, color: '#cfcbcb', marginRight: '20px' }}
              primary={value.count}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default CountryList
