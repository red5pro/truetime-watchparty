import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('md')]: {
        width: '75%',
        flexDirection: 'column',
      },
    },
    buttonContainer: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
  }
})

export default useStyles

export const styles = {
  stage: {
    button: {
      color: 'red',
    },
    participantVideoFeedContainer: {
      width: '80px',
      height: '80px',
    },
    participantVideoFeed: {
      borderRadius: '18px',
    },
  },
}
