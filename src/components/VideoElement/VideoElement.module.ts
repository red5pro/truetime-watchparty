import { makeStyles } from 'tss-react/mui'

const useVideoStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    objectFit: 'cover',
  },
})

export default useVideoStyles
