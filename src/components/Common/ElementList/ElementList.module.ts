import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: '#303030CC',
      padding: '20px',
      borderRadius: '24px',
      maxHeight: '70%',
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
