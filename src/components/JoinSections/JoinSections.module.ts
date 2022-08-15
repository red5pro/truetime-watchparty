import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 75px 0 75px',
    },
    landingContainer: {
      marginTop: '33px',
    },
    nicknameContainer: {
      marginTop: 'calc(100vh / 5)',
    },
    mediaSetupContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 'calc(100vh / 6)',
    },
    conferenceDetails: {
      marginTop: '75px',
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
