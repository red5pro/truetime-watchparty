import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      position: 'absolute',
      left: '40px',
      padding: '10px 20px',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(71, 71, 71, 0.6)',
      borderRadius: '40px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      zIndex: 1000,
    },
  }
})

export default useStyles
