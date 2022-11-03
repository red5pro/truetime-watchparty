import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      backgroundColor: 'black',
    },
    videoStack: {
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
    },
    thumbnailReel: {
      position: 'absolute',
      left: '60px',
      bottom: '60px',
      right: '60px',
      height: '120px',
      justifyContent: 'center',
      zIndex: 200,
    },
    controls: {
      padding: '0 60px',
    },
    playerContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    player: {
      width: 'inherit',
      height: 'inherit',
      objectFit: 'contain',
    },
    playButton: {
      position: 'absolute',
      width: '200px',
      height: '200px',
    },
    playIcon: {
      width: '100%',
      height: '100%',
      filter: 'drop-shadow(0.3rem 0.3rem 0.3rem #000)',
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
  }
})

export default useStyles
