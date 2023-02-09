import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      height: '100%',
    },
    container: {
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '20px',
      position: 'relative',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
      position: 'relative',
      userSelect: 'none',
    },
    subtitle: {
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'left',
      position: 'relative',
      userSelect: 'none',
    },
  }
})

export default useStyles
