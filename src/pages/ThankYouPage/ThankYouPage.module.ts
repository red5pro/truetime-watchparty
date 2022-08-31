import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      backgroundImage:
        'radial-gradient(circle at right, rgba(255,0,0, 0.2) 0%, rgba(0, 0, 0, 1) 70%,rgba(0, 0, 1) 100%)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    brandLogo: {
      position: 'absolute',
    },
    container: {
      padding: '0 75px',
      justifyContent: 'center',
      height: '100vh',
    },
    thankyouMessage: {
      width: '100%',
      maxWidth: '460px',
      fontSize: '36px',
      fontWeight: 600,
    },
  }
})

export default useStyles
