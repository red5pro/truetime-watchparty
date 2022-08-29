const base = {
  topBar: {},
  mainVideoContainer: {},
  mainVideo: {},
  publisherContainer: {},
  publisher: {},
  subscriberList: {},
  subscriberContainer: {},
  subscriber: {},
  subscriberVideo: {},
  vipContainer: {},
  vipsubscriber: {},
  vipsubscriberVideo: {},
}

const styles = {
  stage: {
    ...base,
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
    publisherContainer: {
      position: 'absolute',
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      position: 'absolute',
      left: '24px',
      top: '6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'calc(100vh - 290px)',
    },
    subscriberContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '144px',
      marginTop: '20px',
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
    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
    },
    vipsubscriber: {
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
  fullscreen: {
    ...base,
    mainVideoContainer: {
      position: 'absolute',
      right: 24,
      bottom: 86,
      height: '250px',
      maxWidth: '390px',
      zIndex: -100,
    },
    mainVideo: {
      width: '100%',
      height: '100%',
      borderRadius: '20px',
    },
    publisherContainer: {
      position: 'absolute',
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      position: 'absolute',
      width: '100%',
      height: 'calc(100vh - 480px)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    subscriberContainer: {
      padding: '0 48px',
      display: 'grid',
      gridGap: '20px',
      gridTemplateRows: 'calc((100% / 2)) calc((100% / 2))',
      gridTemplateColumns:
        'calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px)',
      height: '100%',
      marginTop: '0!important',
      justifyContent: 'center',
    },
    subscriber: {
      height: '100%',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
    },
    publisherVideo: {
      height: '100%',
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
    },
    vipContainer: {
      position: 'absolute',
      bottom: '80px',
      left: '24px',
    },
    vipsubscriber: {
      height: '250px',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
  empty: {
    ...base,
    topBar: {
      display: 'none!important',
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
    publisherContainer: {
      opacity: 0.3,
      position: 'absolute',
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      opacity: 0.3,
      position: 'absolute',
      left: '24px',
      top: '6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'calc(100vh - 290px)',
    },
    subscriberContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '144px',
      marginTop: '20px',
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

    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
    },
    vipsubscriber: {
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
}

export default styles
