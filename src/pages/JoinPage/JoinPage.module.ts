import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    formContainer: {
      flexDirection: 'column',
    },
    inputField: {
      margin: '10px 0 !important',
    },
  }
})

export default useStyles
