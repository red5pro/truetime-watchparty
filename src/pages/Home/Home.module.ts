import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    container: {
      margin: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    leftContainer: {
      background: 'linear-gradient(90deg, #1B1828 0%, rgba(20, 20, 20, 0.4) 40%)',
      backdropFilter: 'blur(88px)',
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
  }
})

export default useStyles
