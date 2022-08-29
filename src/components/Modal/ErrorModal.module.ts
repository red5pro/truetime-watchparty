import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      height: '100%',
    },
    container: {
      width: '30rem',
      borderRadius: '20px',
      background: '#FFF 60%',
      color: 'black',
      padding: '20px',
      position: 'relative',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
    message: {
      margin: '20px 0',
    },
    closeButton: {
      textTransform: 'uppercase',
      transition:
        'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      color: 'rgb(25, 118, 210)',
    },
  }
})

export default useStyles
