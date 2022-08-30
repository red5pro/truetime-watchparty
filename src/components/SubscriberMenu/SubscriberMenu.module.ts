import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    listContainer: {
      position: 'absolute',
      left: '40px',
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    listItemIcon: {
      minWidth: '46px',
    },
  }
})

export default useStyles
