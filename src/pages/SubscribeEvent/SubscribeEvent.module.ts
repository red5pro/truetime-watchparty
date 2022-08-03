import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    container: {
      margin: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

export default useStyles
