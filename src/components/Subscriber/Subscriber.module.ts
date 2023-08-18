import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'black',
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
  }
})

export default useStyles
