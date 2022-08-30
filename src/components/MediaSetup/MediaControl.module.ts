import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  root: {
    position: 'relative',
    flexGrow: 1,
    alignItems: 'center',
  },
  button: {
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px!important',
  },
  buttonLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  listContainer: {
    position: 'absolute',
    width: 'max-content',
    top: '50px',
    padding: '4px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(71, 71, 71, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(24px)',
    zIndex: 1000,
  },
  listDivider: {
    margin: '2px',
    backgroundColor: 'white',
  },
})

export default useStyles
