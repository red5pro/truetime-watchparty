import { makeStyles } from 'tss-react/mui'

import { BUTTONSIZE } from './CustomButton'

const getRootStyles = (size: BUTTONSIZE, theme: any) =>
  ({
    [BUTTONSIZE.SMALL]: {
      '& > *': {
        margin: theme.spacing(1),
        fontSize: '14px',
        lineHeight: '18',
        maxWidth: '139px',
        minWidth: '139px',
        padding: '8px',
        boxShadow: 'none',
        fontWeight: 700,
        fontStyle: 'normal',
        cursor: 'pointer',
        transition: '.3s all',
        height: '32px',
        [theme.breakpoints.down('md')]: {
          fontSize: '11px',
        },
      },
      '& p': {
        fontSize: '14px',
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
          fontSize: '11px',
        },
      },
    },
    [BUTTONSIZE.MEDIUM]: {
      '& > *': {
        margin: theme.spacing(1),
        fontSize: '16px',
        lineHeight: '18',
        minWidth: '190px',
        padding: '8px',
        boxShadow: 'none',
        fontWeight: 700,
        fontStyle: 'normal',
        cursor: 'pointer',
        transition: '.3s all',
        height: '40px',
        [theme.breakpoints.down('md')]: {
          fontSize: '14px',
          minWidth: 'auto',
        },
      },
      '& p': {
        fontSize: '16px',
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
          fontSize: '14px',
        },
      },
    },
    [BUTTONSIZE.LARGE]: {
      '& > *': {
        margin: theme.spacing(1),
        fontSize: '20px',
        lineHeight: '18',
        minWidth: '210px',
        padding: '8px',
        boxShadow: 'none',
        fontWeight: 700,
        fontStyle: 'normal',
        cursor: 'pointer',
        transition: '.3s all',
        height: '54px',
        [theme.breakpoints.down('md')]: {
          fontSize: '18px',
        },
      },
      '& p': {
        fontSize: '20px',
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
          fontSize: '18px',
        },
      },
    },
  }[size])

const useStyles = (size: BUTTONSIZE) =>
  makeStyles()((theme: any) => ({
    root: getRootStyles(size, theme),
    primary: {
      boxSizing: 'border-box',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      color: 'rgba(27, 27, 27, 0.95)',
      '& > *': {
        fill: 'rgba(27, 27, 27, 0.95)',
      },
      '&:hover': {
        backgroundColor: '#FFFFFF',
      },
    },
    secondary: {
      boxSizing: 'border-box',
      backgroundColor: '#80FF44',
      borderRadius: '24px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      color: '#303030',
      '& > *': {
        fill: '#303030',
      },
      '&:hover': {
        backgroundColor: '#80FF44',
      },
    },
    tertiary: {
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
      borderRadius: '24px',
      border: '1px solid #FFFFFF',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      color: '#FFFFFF',
      '& > *': {
        fill: '#FFFFFF',
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    facebook: {
      padding: '0 15px',
      boxSizing: 'border-box',
      backgroundColor: '#2050CC',
      borderRadius: '24px',
      border: '1px solid #2050CC',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      color: '#FFFFFF',
      '& > *': {
        fill: '#FFFFFF',
      },
      '&:hover': {
        backgroundColor: '#2050CC',
      },
    },
  }))

export default useStyles
