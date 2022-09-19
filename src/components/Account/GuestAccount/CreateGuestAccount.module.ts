import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    height: '100%',
    backdropFilter: 'blur(88px)',
    width: '100%',
    overflow: 'auto',
    position: 'relative',
  },
  container: {
    width: '30rem',
    borderRadius: '20px',

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
    fontSize: '14px',
  },
  brandLogo: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  errorTextField: {
    color: '#d32f2f',
    border: '1px solid #d32f2f',
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
  textField: {
    height: '80px !important',
    width: '100%',
    padding: '9px 14px',
    margin: '30px 0 10px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid #655f5f',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontFamily: 'inherit',
    letterSpacing: 'inherit',
    font: 'inherit',
  },
  selectField: {
    '& svg': {
      fill: 'white',
    },
  },
  item: {},
  menuItem: {
    backgroundColor: '#30303099',
    '&&.Mui-selected': {
      backgroundColor: '#3030305c',
    },
    '&&:hover': {
      backgroundColor: '#30303073',
    },
  },
}))

export default useStyles
