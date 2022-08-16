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
