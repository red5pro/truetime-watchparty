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

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {
      // background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      background: 'radial-gradient(circle at right, rgba(255,0,0, 0.2) 0%, rgba(0, 0, 0, 1) 70%,rgba(0, 0, 1) 100%)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    loadingContainer: {
      alignItems: 'center',
      position: 'absolute',
      top: 20,
      display: 'flex',
      width: '100%',
      zIndex: 10,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    brandLogo: {
      position: 'absolute',
      zIndex: 100,
    },
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
    },
    stepsContainer: {
      backdropFilter: 'blur(50px)',
    },
    watchContainer: {
      backdropFilter: 'unset',
    },
    text: {
      fontSize: '18px',
      fontWeight: 'normal',
    },
    link: {
      color: '#303030',
      textDecoration: 'none',
    },
    mainVideoContainer: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
    },
    mainVideo: {
      width: '100%',
      height: '100%',
      borderRadius: 'unset',
    },
  }
})

export default useStyles
