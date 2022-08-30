import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    backButton: {
      position: 'absolute',
      top: '3rem',
      left: '15%',
      zIndex: 2,
      color: 'white !important',
      border: 'solid 1px #FFFFFF',
      backgroundColor: 'transparent',
      width: '40px',
      minWidth: '40px',
      height: '40px',
      borderRadius: '20px',

      [theme.breakpoints.down('sm')]: {
        top: '1rem',
      },

      '& svg': {
        display: 'block',
        margin: '0 2px 0 8px',
      },
    },
    brandLogo: {
      position: 'absolute',
    },
  }
})

export default useStyles
