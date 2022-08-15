import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    rootContainer: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    mainVideo: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: 0,
    },
    content: {
      zIndex: 1,
    },
  }
})

export default useStyles
