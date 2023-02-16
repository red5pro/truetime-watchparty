import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    height: '100%',
    // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
    backdropFilter: 'blur(88px)',
    width: '100%',
    overflow: 'auto',
    position: 'relative',
  },
  container: {
    width: '30rem',
    borderRadius: '20px',
    background: '#303030 60%',
    padding: '32px',

    [theme.breakpoints.down('md')]: {
      width: '75%',
    },
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
  },
  input: {
    marginTop: '20px',
    '& > div': { width: '100% !important' },
  },
  signInButton: {
    margin: '24px 0 12px 0',
  },
  errorValidation: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: '14px',
  },
  errorTextField: {
    '& label': {
      color: '#d32f2f',
    },
    '& input': {
      border: '1px solid #d32f2f',
    },

    '& fieldset': {
      border: 'none',
    },
  },

  buttonsContainer: {
    '& div:first-of-type': {
      marginRight: '8px !important',
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
      },
    },
    '& div:last-child': {
      marginLeft: '8px !important',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))

export default useStyles
