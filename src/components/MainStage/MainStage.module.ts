import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    rootContainer: {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      alignItems: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
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
    organizerTopControls: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      maxHeight: '5rem',
      zIndex: 1,
    },
    topBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100vw',
    },
    webinarTopBar: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '86vw',
    },
    header: {
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
      justifyContent: 'flex-end',
    },
    bottomBar: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      left: 0,
      bottom: 0,
      padding: '15px',
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '6rem',
    },
    layoutContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    moreButton: {
      margin: 'auto',
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

    shareScreenButton: {
      width: 'fit-content !important',
      minWidth: 'fit-content',
      margin: 0,
      padding: '20px 10px',
    },
  }
})

export default useStyles
