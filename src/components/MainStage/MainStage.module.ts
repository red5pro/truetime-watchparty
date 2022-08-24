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
    bottomBar: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    bottomControls: {
      position: 'relative',
      width: '100%',
      alignItems: 'center',
    },
    layoutContainer: {
      position: 'absolute',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    },
  }
})

export default useStyles
