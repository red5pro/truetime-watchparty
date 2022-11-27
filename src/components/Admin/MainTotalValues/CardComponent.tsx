import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import useStyles from './MainTotal.module'

interface ICardComponentProps {
  text: string
  value: string | number
}

const CardComponent = ({ text, value }: ICardComponentProps) => {
  const { classes } = useStyles()

  return (
    <Card className={classes.root} sx={{ maxWidth: 275, backgroundColor: '#303030' }}>
      <CardContent className={classes.container}>
        <Typography fontSize="16px" className={classes.cardText}>
          {text}
        </Typography>
        <Typography fontSize="24px" marginTop={2} sx={{ mb: 1.5 }} className={classes.cardText}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardComponent
