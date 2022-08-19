import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transform: 'scaleX(-1)',
    },
    loading: {
      position: 'absolute',
      zIndex: 10,
    },
  }
})

export default useStyles
