import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    container: {
      backgroundColor: 'black',
    },
    brandLogo: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    topTitle: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '20px',
      letterSpacing: '0em',
      textAlign: 'center',
      color: '#FFFFFF',
    },
  }
})

export default useStyles
