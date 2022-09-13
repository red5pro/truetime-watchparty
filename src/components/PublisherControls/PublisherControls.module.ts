import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  button: {
    '& span': {
      marginRight: '6px',
    },
  },
})

export default useStyles
