import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      height: '100vh',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
      },
    },
    leftContainer: {
      background: 'linear-gradient(to bottom right, #1b1828,#000000)',
      backdropFilter: 'blur(88px)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: '15%',
      width: '60%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    titleContainer: {
      margin: '2.5rem 0',
    },
    title: {
      fontSize: '90px',
      fontWeight: '600',
      lineHeight: '104px',
      letterSpacing: '-0.018em',
    },
    subtitle: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '32px',
    },
    partyCode: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '25.65px',
    },
    input: {},
    link: {
      fontWeight: 600,
    },
    rightContainer: {
      width: '40%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
      },
    },
    imageContainer: {
      width: '100%',
      height: '100vh',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
      },
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'right',
    },
    errorValidation: {
      color: '#d32f2f',
      fontSize: '14px',
    },
  }
})

export default useStyles
