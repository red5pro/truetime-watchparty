import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      zIndex: 0,
      backgroundColor: 'black',
    },
    videoStack: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100wh',
      height: '100vh',
      backgroundColor: 'black',
    },
    thumbnailControlsContainer: {
      position: 'absolute',
      left: '60px',
      bottom: '60px',
      right: '60px',
    },
    thumbnailReel: {
      height: '120px',
      justifyContent: 'center',
      zIndex: 200,
      rowGap: '10px',
    },
    controls: {
      height: '70px',
      alignItems: 'center',
      padding: '0 calc(100% / 4)',
      filter: 'drop-shadow(0.3rem 0.3rem 0.3rem #000)',
      zIndex: 201,
    },
    playerContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      flexGrow: 1,
      zIndex: 1,
    },
    player: {
      width: 'inherit',
      // height: 'inherit',
      height: '400px',
      objectFit: 'cover',
    },
    playButton: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      zIndex: 2,
    },
    playIcon: {
      width: '100%',
      height: '100%',
      filter: 'drop-shadow(0.3rem 0.3rem 0.3rem #000)',
    },
    pauseButton: {},
    pauseIcon: {
      width: '40px',
      height: '40px',
    },
    thumbnailContainer: {
      position: 'relative',
      borderRadius: '20px',
      backgroundColor: 'black',
      maxWidth: '120px',
    },
    thumbnail: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      aspectRatio: '1 / 1',
      borderRadius: '20px',
      filter: 'drop-shadow(0.3rem 0.3rem 0.3rem #000)',
    },
    thumbnailLabel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '5px',
      textAlign: 'right',
      backdropFilter: 'blur(5px)',
      boxSizing: 'border-box',
      paddingRight: '20px',
      borderRadius: '0 0 20px 20px',
    },
    driverControl: {
      zIndex: 10,
      backgroundColor: 'floralwhite',
      color: 'black',
      width: 'fit-content',
      padding: '5px 20px',
      margin: '-20px auto 20px auto',
    },
  }
})

export default useStyles
