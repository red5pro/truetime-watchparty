import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      background: 'radial-gradient(circle at right, rgba(255,0,0, 0.2) 0%, rgba(0, 0, 0, 1) 70%,rgba(0, 0, 1) 100%)',
      width: '100%',
      height: '100vh',
    },
    brandLogo: {
      position: 'absolute',
    },
    sponsorContainer: {
      position: 'relative',
      left: '74px',
      margin: '10px 0',
    },
    joinTitleLarge: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 400,
    },
    joinTitleSmall: {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 400,
    },
    joinSection: {
      width: '100%',
      height: '100%',
      padding: '0 75px 0 75px',
      display: 'flex',
      flexDirection: 'column',
    },
    landingContainer: {
      marginTop: '15px',
      zIndex: 1,
    },
    loadingContainer: {
      position: 'absolute',
      display: 'flex',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    nicknameContainer: {},
    mediaSetupContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 'calc(100vh / 6)',
    },
    conferenceDetails: {
      marginTop: '20px',
    },
    landingJoin: {
      marginTop: '80px',
    },
    nicknameForm: {
      marginTop: 'calc(100vh / 8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
    },
    formContainer: {
      flexDirection: 'column',
      margin: 'unset',
    },
    inputField: {},
    buttonContainer: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      alignItems: 'center',
    },
    mediaSetupButtons: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      textAlign: 'center',
      width: 'calc(100vw / 3)',
      justifyContent: 'center',
    },
    backButton: {
      zIndex: 2,
      color: 'white !important',
      border: 'solid 1px #FFFFFF',
      backgroundColor: 'transparent',
      width: '40px',
      minWidth: '40px',
      height: '40px',
      borderRadius: '20px',

      [theme.breakpoints.down('sm')]: {
        top: '1rem',
      },

      '& svg': {
        display: 'block',
        margin: '0 2px 0 8px',
      },
    },
  }
})

export default useStyles
