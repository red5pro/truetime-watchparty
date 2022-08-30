import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    height: '100%',
    background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
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
  errorValidation: {
    color: '#d32f2f',
  },
  brandLogo: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
}))

export default useStyles
