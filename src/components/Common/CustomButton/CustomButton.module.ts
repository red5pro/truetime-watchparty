/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { makeStyles } from 'tss-react/mui'

import { BUTTONSIZE } from './CustomButton'

const getRootStyles = (size: BUTTONSIZE, theme: any) => {
  const root = {
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
        maxWidth: '190px',
        padding: '8px',
        boxShadow: 'none',
        fontWeight: 700,
        fontStyle: 'normal',
        cursor: 'pointer',
        transition: '.3s all',
        height: '40px',
        [theme.breakpoints.down('md')]: {
          fontSize: '14px',
        },
      },
      '& p': {
        fontSize: '15px',
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
        maxWidth: '210px',
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
  }[size]
  return root
}

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
      padding: '0 10px',
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
    leave: {
      padding: '0 15px',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 71, 71, 0.6)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(24px)',
      color: '#FFFFFF',
      '& > *': {
        fill: '#FFFFFF',
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 71, 71, 0.6)',
      },
    },
    transparent: {
      padding: '0 15px',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(48, 48, 48, 0.6)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(24px)',
      color: '#E6E8EC',
      '& > *': {
        fill: '#E6E8EC',
      },
      '&:hover': {
        backgroundColor: 'transpatent',
      },
    },
  }))

export default useStyles
