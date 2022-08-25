import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    avSetup: {
      position: 'relative',
      top: -50,

      '& > div': {
        marginTop: '3rem',
      },

      [theme.breakpoints.down('sm')]: {
        '& > div': {
          margin: '0 12px',
        },

        '& video': {
          width: '100%',
        },
      },
    },
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('sm')]: {
        width: '75%',
        marginBottom: '16px',
        flexDirection: 'column',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
  }
})

export default useStyles
