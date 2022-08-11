import { makeStyles } from 'tss-react/mui'

const useMediaStyles = makeStyles()({
  container: {
    margin: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    borderRadius: '30px',
  },
})

export default useMediaStyles
