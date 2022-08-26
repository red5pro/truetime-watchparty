import { calculateNewValue } from '@testing-library/user-event/dist/utils'
import { makeStyles } from 'tss-react/mui'

const useMediaStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    borderRadius: '20px',
    height: 'calc(100vh / 3)',
    minHeight: '360px',
    backgroundColor: 'black',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
  },
})

export default useMediaStyles
