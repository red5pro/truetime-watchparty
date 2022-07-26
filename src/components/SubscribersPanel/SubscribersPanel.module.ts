import { makeStyles } from 'tss-react/mui'

const useVideoStyles = makeStyles()(() => {
  return {
    formContainer: {
      flexDirection: 'column',
    },
    container: {
      margin: '1rem',
    },
    inputField: {
      margin: '10px 0 !important',
    },
    video: {},
    select: {},
    menuItem: {},
    item: {},
  }
})

export default useVideoStyles
