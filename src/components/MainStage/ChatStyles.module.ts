import { makeStyles } from 'tss-react/mui'

const useChatStyles = makeStyles()((theme: any) => ({
  container: {},

  chatContainer: {
    borderRadius: '24px',
    padding: '20px',
    width: '30rem',
    position: 'absolute',
    bottom: '5rem',
    zIndex: 10,
    background: 'rgba(48, 48, 48, 0.6) 30%',
    filter: 'opacity(0.8)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: 'white',

    '& .pn-msg:hover': {
      background: 'none',
    },

    '& .pn-msg-list': {
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
      height: '60vh',
      scrollBehavior: 'smooth',
    },

    '& .pn-msg-input': {
      padding: '15px 0',
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
    },

    '& .pn-msg__reaction--active': {
      fontSize: '1rem',
    },

    '& span': {
      color: '#E6E8EC',
    },

    '& .pn-msg__bubble': {
      color: '#FFFFFF',
      fontSize: '14px',
      lineHeight: '19px',
      border: '1px solid #303030',
      borderRadius: '20px',
      padding: '8px 14px',
      background: '#303030',
    },

    '& .pn-msg__avatar': {
      // CHECK THIS
      // display: 'none',
      marginTop: '8px',
    },

    '& .pn-msg__time, .pn-msg__author': {
      display: 'none',
    },

    '& .pn-msg__actions': {
      top: '20px',
    },

    '& .pn-msg__actions > *:hover': {
      color: '#e4e9f0',
    },

    '& .pn-msg-input__icons': {
      marginTop: '8px',
      position: 'absolute',
      right: '30px',
    },

    '& .pn-msg-input__emoji-picker': {
      bottom: '9rem',
      left: 'unset',
      position: 'relative',
    },

    '& .pn-msg-input__send--active': {
      color: '#e4e9f0',
    },

    '& .pn-msg--own': {
      '--msg__avatar__margin': '0 0 0 18px',
      '--msg__content__alignItems': 'flex-end',
      '--msg__flexDirection': 'row-reverse',
      '--msg__title__flexDirection': 'row-reverse',
      '--msg__padding': 0,

      '& .pn-msg__avatar': {
        display: 'none !important',
      },

      '& .pn-msg__actions': {
        right: 'unset',
        top: '20px',
        left: '10px',
      },

      '& .pn-msg__main': {
        alignItems: 'flex-end',
      },

      '& .pn-msg__bubble': {
        backgroundColor: 'rgba(230, 232, 236, 0.8)',
        color: 'rgba(27, 27, 27, 0.95)',
      },
    },

    '& .pn-typing-indicator': {
      background: 'transparent',
      color: 'white',
    },
  },

  fullScreenChatContainer: {
    '& .pn-msg-list': {
      height: '30vh !important',
    },
  },

  inputChatContainer: {
    width: '20rem',

    '& .pn-msg-input__textarea, .pn-msg-input__textarea:focus-within': {
      background: 'rgba(48, 48, 48, 0.6) 30%',
      filter: 'opacity(0.8)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'white',
      '--msg-input__textarea__padding': '6px 34px 8px 14px',
    },

    '& .pn-msg-input__emoji-picker': {
      right: 0,
      left: 'unset',
    },

    '& .pn-msg-input': {
      background: 'transparent',
      width: '25rem',
    },

    '& .pn-msg-input__send': {
      display: 'none',
    },

    '& .pn-msg-input__icons': {
      marginTop: '5px',
      position: 'absolute',
      right: '0px',
      zIndex: 10,
    },
  },
}))

export default useChatStyles