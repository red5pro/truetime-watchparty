import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    form: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: 0,
      left: 0,
    },
    formContainer: {
      backgroundColor: '#444',
      borderRadius: '20px',
      padding: '20px',
    },
    watchContainer: {
      width: '100vh',
      height: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      rowGap: '20px',
      padding: '20px',
    },
    subscriberContainer: {
      width: '100vh',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      rowGap: '10px',
      flexWrap: 'wrap',
    },
  }
})

export default useStyles
