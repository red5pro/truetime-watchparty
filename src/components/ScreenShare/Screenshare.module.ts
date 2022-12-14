import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    loading: {
      position: 'absolute',
      zIndex: 10,
    },
    iconBar: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    accountIcon: {
      position: 'absolute',
    },
    publisher: {
      height: '100%',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'center',
      transform: 'none !import',
      aspectRatio: 'unset',
    },
  }
})

export default useStyles
