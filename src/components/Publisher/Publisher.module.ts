import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'black',
      borderRadius: '20px',
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
      margin: '50%',
    },
  }
})

export default useStyles
