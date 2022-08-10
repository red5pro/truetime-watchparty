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
      width: '100%',
      height: '100%',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    leftContainer: {
      display: 'flex',
      flexDirection: 'column',

      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: '15%',
      width: '60%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    buttonContainer: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    link: {
      fontWeight: 600,
      fontSize: '14px',
    },
    rightContainer: {
      width: '40%',
      backgroundColor: 'transparent',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
      },
    },
  }
})

export default useStyles
