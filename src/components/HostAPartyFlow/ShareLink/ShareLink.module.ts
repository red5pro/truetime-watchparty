import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      height: '100%',
    },
    container: {
      width: '30rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '20px',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
    },
    buttonsContainer: {
      '& div:first-child': {
        marginRight: '8px',
        [theme.breakpoints.down('sm')]: {
          marginRight: 0,
        },
      },
      '& div:last-child': {
        marginLeft: '8px',
        [theme.breakpoints.down('sm')]: {
          marginLeft: 0,
        },
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    linkToJoin: {
      color: '#303030',
      textDecoration: 'none',
    },

    linkToJoinWebinar: {
      textDecoration: 'none',
    },
  }
})

export default useStyles
