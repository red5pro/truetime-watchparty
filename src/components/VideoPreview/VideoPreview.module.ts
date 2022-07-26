import { makeStyles } from 'tss-react/mui'

const useVideoStyles = makeStyles()(() => {
  return {
    formContainer: {
      flexDirection: 'column',
    },
    container: {
      maxWidth: '640px',
      margin: 'auto',
    },
    inputField: {
      margin: '10px 0 !important',
    },
    video: {
      transform: 'rotateY(180deg)',
      WebkitTransform: 'rotateY(180deg)',

      // /* Safari and Chrome */
      MozTransition: 'rotateY(180deg)',
    },
    select: {},
    menuItem: {},
    item: {},
  }
})

export default useVideoStyles
