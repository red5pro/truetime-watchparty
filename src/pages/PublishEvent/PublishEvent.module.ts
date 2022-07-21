import { makeStyles } from 'tss-react/mui'

const usePublishStyles = makeStyles()(() => {
  return {
    container: {
      margin: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

export default usePublishStyles
