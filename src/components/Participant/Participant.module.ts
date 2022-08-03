import { makeStyles } from 'tss-react/mui'

const useParticipantStyles = makeStyles()(() => {
  return {
    hangOff: {
      position: 'fixed',
      bottom: '5px',
      right: '5px',
      cursor: 'pointer',
    },
    ownVideo: {},
  }
})

export default useParticipantStyles
