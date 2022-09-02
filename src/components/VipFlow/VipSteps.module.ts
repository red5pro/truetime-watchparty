import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      background: 'radial-gradient(circle at right, rgba(255,0,0, 0.2) 0%, rgba(0, 0, 0, 1) 70%,rgba(0, 0, 1) 100%)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    loadingContainer: {
      alignItems: 'center',
      position: 'absolute',
      top: 20,
      display: 'flex',
      width: '100%',
      zIndex: 10,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    brandLogo: {
      position: 'absolute',
      zIndex: 100,
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
    stepsContainer: {
      backdropFilter: 'blur(50px)',
    },
    watchContainer: {
      backdropFilter: 'unset',
    },
    text: {
      fontSize: '18px',
      fontWeight: 'normal',
    },
    link: {
      color: '#303030',
      textDecoration: 'none',
    },
    mainVideoContainer: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
    },
    mainVideo: {
      width: '100%',
      height: '100%',
      borderRadius: 'unset',
    },
  }
})

export default useStyles
