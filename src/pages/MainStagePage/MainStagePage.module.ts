import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    mainVideo: {
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
    },
  }
})

export default useStyles
