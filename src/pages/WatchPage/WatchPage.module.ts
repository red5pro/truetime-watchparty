import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    rootContainer: {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '50px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      width: '100%',
      textAlign: 'center',
      margin: '20px',
    },
    listsGrid: {
      display: 'flex',
      flexDirection: 'row',
      columnGap: '20px',
      width: '100%',
      justifyContent: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      alignItems: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    listContainer: {
      // width: '100%',
      // maxWidth: 360,
      minWidth: '460px',
      // width: 'fit-content',
      backgroundColor: '#303030',
      padding: '20px',
      borderRadius: '24px',
      overflow: 'scroll',
    },
    itemButton: {},
    itemDisplayName: {
      '& span': {
        fontSize: '18px',
        fontWeight: 600,
      },
    },
  }
})

export default useStyles
