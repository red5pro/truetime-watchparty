import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    text: {
      fontSize: '18px',
      fontWeight: 'normal',
    },
    link: {
      color: '#303030',
      textDecoration: 'none',
    },
  }
})

export default useStyles
