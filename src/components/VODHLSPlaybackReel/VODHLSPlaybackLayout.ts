const styles = {
  stage: {
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    stack: {},
    vodPlayer: {},
    thumbnailContainer: {},
    reel: {},
    thumbnail: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    controls: {},
  },
  fullscreen: {
    container: {
      zIndex: '210!important',
      position: 'absolute',
      right: '60px',
      bottom: '120px',
      width: 'calc(100vw / 4)',
      height: 'unset',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '10px',
      backgroundColor: 'unset!important',
    },
    stack: {
      aspectRatio: '1 / 1',
      maxHeight: '240px!important',
      position: 'relative!important',
    },
    vodPlayer: {
      borderRadius: '20px!important',
    },
    thumbnailContainer: {
      position: 'unset!important',
    },
    reel: {
      height: '80px!important',
    },
    thumbnail: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
      maxWidth: '80px!important',
    },
    controls: {
      padding: '0!important',
    },
  },
  empty: {
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    stack: {},
    vodPlayer: {},
    thumbnailContainer: {},
    reel: {},
    thumbnail: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    controls: {},
  },
}

export default styles
