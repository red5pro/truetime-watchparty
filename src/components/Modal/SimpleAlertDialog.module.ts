import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    title: {
      fontSize: '18px',
      fontWeight: 600,
      color: 'black',
    },
    button: {
      textTransform: 'uppercase',
      transition:
        'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      color: 'rgb(25, 118, 210)',
    },
  }
})

export default useStyles
