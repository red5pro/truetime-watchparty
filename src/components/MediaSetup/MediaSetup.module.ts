import { calculateNewValue } from '@testing-library/user-event/dist/utils'
import { makeStyles } from 'tss-react/mui'

const useMediaStyles = makeStyles()({
  container: {
    margin: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    borderRadius: '20px',
    width: 'auto',
    height: 'calc(100vh / 3)',
  },
})

export default useMediaStyles
