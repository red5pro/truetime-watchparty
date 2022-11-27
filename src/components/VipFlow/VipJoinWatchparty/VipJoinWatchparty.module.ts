import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    avSetup: {
      position: 'relative',
      top: -50,

      '& > div': {
        marginTop: '3rem',
      },

      [theme.breakpoints.down('sm')]: {
        '& > div': {
          margin: '0 12px',
        },

        '& video': {
          width: '100%',
        },
      },
    },
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('sm')]: {
        width: '75%',
        marginBottom: '16px',
        flexDirection: 'column',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
    header: {
      width: '100%',
      position: 'absolute',
      top: 20,
      zIndex: 0,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: 400,
      textAlign: 'center',
    },
    headerDivider: {
      height: '19px',
      width: '1px',
      borderLeft: '1px solid rgb(211, 211, 211, 0.3)',
      margin: '10px',
    },
    loadingContainer: {
      alignItems: 'center',
      marginTop: '10%',
      zIndex: 200,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    subscriberList: {
      position: 'absolute',
      left: '24px',
      top: '6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'calc(100vh - 12px)',
    },
    subscriberContainer: {
      display: 'flex',
      flexDirection: 'column',
      // width: '144px',
      aspectRatio: '0.25',
      margin: '20px 0',
      paddingRight: '20px',
      alignItems: 'center',
      height: '100%',
      rowGap: '10px',
    },
    subscriber: {
      maxHeight: '124px',
      flexGrow: 1,
      height: '100%',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
    },
    participantsLoading: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
  }
})

export default useStyles
