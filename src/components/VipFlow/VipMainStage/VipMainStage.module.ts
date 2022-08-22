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
    topHeader: {
      height: '50px',
      position: 'absolute',
      zIndex: 10,
    },
    loadingContainer: {
      position: 'absolute',
      top: '4px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
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
      fontSize: '16px',
      fontWeight: 400,
      width: '100%',
      textAlign: 'center',
      position: 'absolute',
      top: 20,
      zIndex: 0,
    },
    topControls: {
      zIndex: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    vipOwnVideo: {
      position: 'absolute',
      right: '20px',
      top: '4rem',
      maxWidth: '350px',
    },
    participantsView: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: '20px',
    },
  }
})

export default useStyles
