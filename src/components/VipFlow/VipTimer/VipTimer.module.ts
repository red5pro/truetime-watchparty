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
    timer: {
      width: '85px !important',
      height: '85px !important',
      border: '3px solid #2864FF',
      borderRadius: '50%',
      backdropFilter: 'blur(60px)',
      margin: '0 20px',
      '& p': {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: 700,
      },
    },
  }
})

export default useStyles
