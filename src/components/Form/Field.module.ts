import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  formField: {
    width: '100%',

    '& input::placeholder': {
      opacity: '0',
    },
    '& input:focus::placeholder': {
      opacity: '1',
    },
  },
  input: {
    marginTop: '20px',
    '& > div': { width: '100% !important' },
  },
  icon: {
    width: 'fit-content',
    position: 'absolute',
    top: '27px',
    right: '15px',
    '& svg': {
      fill: 'lightgray',
    },
  },
}))

export default useStyles
