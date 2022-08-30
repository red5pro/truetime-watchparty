import { calculateNewValue } from '@testing-library/user-event/dist/utils'
import { makeStyles } from 'tss-react/mui'

const useMediaStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    right: '20px',
    top: '20px',
  },
  errorAlert: {
    alignItems: 'center',
    marginBottom: '6px',
    padding: '2px 12px',
    width: '100%',
  },
  video: {
    borderRadius: '20px',
    height: 'calc(100vh / 3)',
    minHeight: '360px',
    maxWidth: '480px',
    backgroundColor: 'black',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
  },
  controls: {
    maxWidth: '480px',
    width: '100%',
  },
  mediaControl: {
    flexGrow: 1,
  },
})

export default useMediaStyles
