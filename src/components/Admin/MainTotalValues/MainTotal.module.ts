import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    borderRadius: '16px',
    margin: '2rem 0',
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
