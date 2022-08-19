import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    text: {
      fontSize: '18px',
      fontWeight: 'normal',
    },
    link: {
      color: '#303030',
      textDecoration: 'none',
    },
  }
})

export default useStyles
