import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    rootContainer: {
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      position: 'relative',
    },
    loadingContainer: {
      alignItems: 'center',
      marginTop: '10%',
    },
    mainVideo: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
    },
    content: {
      zIndex: 1,
    },
    topBar: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
    topControls: {
      zIndex: 1,
    },
    bottomBar: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      left: 0,
      bottom: 0,
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
    },
    layoutContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    chatInput: {
      width: '45%',
      maxWidth: '240px',
    },
    publishControls: {
      position: 'absolute',
      left: '24px',
    },
    partyControls: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      alignItems: 'center',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',

      '& label': {
        width: '32px',
        height: '32px',
      },
    },
  }
})

export default useStyles
