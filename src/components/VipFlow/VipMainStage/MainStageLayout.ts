const styles = {
  stage: {
    button: {
      color: 'red',
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
      paddingRight: '20px',
      paddingBottom: '30px',
      alignItems: 'center',
      overflow: 'scroll',
    },
    subscriber: {
      marginTop: '18px',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
      aspectRatio: '1 / 1',
      height: '100%',
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
    publisherVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
      width: '260px',
    },
  },
  fullscreen: {
    button: {
      color: 'green',
    },
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
      top: '80px',
      width: '100%',
      height: 'calc(100vh - 460px)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    subscriberContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '50%',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '18px',
    },
    subscriber: {
      marginRight: '9px',
      marginLeft: '9px',
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
}

export default styles
