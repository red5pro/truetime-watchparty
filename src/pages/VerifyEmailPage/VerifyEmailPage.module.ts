import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      backdropFilter: 'blur(88px)',
      background: 'radial-gradient(circle at right, rgba(255,0,0, 0.2) 0%, rgba(0, 0, 0, 1) 70%,rgba(0, 0, 1) 100%)',
      width: '100%',
      minHeight: '100%',
    },
    brandLogo: {
      position: 'absolute',
    },
    joinTitleSmall: {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 400,
    },
  }
})

export default useStyles
