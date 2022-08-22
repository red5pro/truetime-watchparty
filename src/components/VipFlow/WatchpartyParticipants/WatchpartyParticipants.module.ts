import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
  }
})

export default useStyles
