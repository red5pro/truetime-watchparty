import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    height: '100%',
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
  errorValidation: {
    color: '#d32f2f',
  },
}))

export default useStyles
