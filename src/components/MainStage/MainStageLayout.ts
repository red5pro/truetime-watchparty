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
      transform: 'scaleX(-1)',
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
      transform: 'scaleX(-1)',
    },
  },
}

export default styles
