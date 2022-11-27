import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },
  tabs: {
    border: '1px solid #676161',
    width: 'fit-content',
    borderRadius: '50px',
  },
  currTab: {
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'black !important',
    animationDuration: '6s',
    // transform: 'translateX(2%)',
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 2ms',
  },
  nonCurrTab: {
    color: 'white',
  },
  container: {
    paddingBottom: '16px !important',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    border: '1px solid #676161',
    borderRadius: '16px',
  },
  cardText: {
    fontWeight: '600',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    color: '#FBFBFB',
    flex: 'none',
    order: '0',
    alignSelf: 'stretch',
    flexGrow: '0',
  },
}))

export default useStyles
