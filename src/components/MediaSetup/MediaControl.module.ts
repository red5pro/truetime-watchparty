import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  root: {
    position: 'relative',
  },
  button: {
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  listContainer: {
    position: 'absolute',
    top: '50px',
    padding: '4px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(71, 71, 71, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(24px)',
    width: '180px',
    zIndex: 1000,
  },
  listDivider: {
    margin: '2px',
    color: 'white',
  },
})

export default useStyles
