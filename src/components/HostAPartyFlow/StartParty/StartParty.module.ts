import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {},
    container: {
      marginTop: '5rem',
      marginLeft: '15%',
      [theme.breakpoints.down('sm')]: {
        marginTop: '3rem',
      },
    },

    buttonContainer: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    link: {
      fontWeight: 'normal',
      fontSize: '14px',
    },
    formContainer: {},
    textField: {
      height: '80px !important',
      width: '290px',
      padding: '9px 14px',
      margin: '9px 0',
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
    errorTextField: {
      border: '1px solid #d32f2f',

      '& fieldset': {
        border: 'none',
      },
    },
    errorValidation: {
      color: '#d32f2f',
    },
    checkbox: {
      padding: '0',
      color: '#655f5f',
      '& svg': {
        fill: 'lightgray',
      },
    },
    item: {},
    menuItem: {
      backgroundColor: '#2a4283e8',
      '&&.Mui-selected': {
        backgroundColor: '#2a4283c4',
      },
      '&&:hover': {
        backgroundColor: '#2a4283c4',
      },
    },

    image: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      opacity: '0.6',
      zIndex: '-1',
    },
  }
})

export default useStyles
