import { makeStyles } from 'tss-react/mui'

const usePublisherStyles = makeStyles()(() => {
  return {
    hangOff: {
      position: 'fixed',
      bottom: '5px',
      right: '5px',
      cursor: 'pointer',
    },
  }
})

export default usePublisherStyles
