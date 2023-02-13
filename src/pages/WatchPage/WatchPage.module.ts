import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    rootContainer: {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      display: 'flex',
    },
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      alignItems: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
  }
})

export default useStyles
