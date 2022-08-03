import { makeStyles } from 'tss-react/mui'

const usePanelStyles = makeStyles()(() => {
  return {
    formContainer: {
      flexDirection: 'column',
    },
    container: {
      margin: '1rem',
    },
    inputField: {
      margin: '10px 0 !important',
    },
    video: {},
    select: {},
    menuItem: {},
    item: {},
    mediaControlsContainer: {
      position: 'relative',
      bottom: '40px',

      '& svg': {
        color: '#e4e1e5',
        cursor: 'pointer',
      },
    },
  }
})

export default usePanelStyles
