import { makeStyles } from 'tss-react/mui'

const useVideoStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  video: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
})

export default useVideoStyles
