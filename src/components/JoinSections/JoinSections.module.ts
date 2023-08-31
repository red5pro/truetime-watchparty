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
      background: 'linear-gradient(to bottom right, #1b1828,#2a448a)',
      backdropFilter: 'blur(88px)',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 75px 0 75px',
    },
    landingContainer: {
      margin: 'auto 0',
      width: '70%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    nicknameContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    mediaSetupContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    conferenceDetails: {},
    landingJoin: {
      marginTop: '25px!important',
    },
    nicknameForm: {
      marginTop: 'calc(100vh / 8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
    },
    formContainer: {
      flexDirection: 'column',
      margin: 'unset',
    },
    inputField: {},
    buttonContainer: {
      alignItems: 'center',
    },
    mediaSetupButtons: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      textAlign: 'center',
      width: 'calc(100vw * 2/3)',
      maxWidth: '480px',
      justifyContent: 'center',
    },
    backButton: {
      zIndex: 2,
      color: 'white !important',
      border: 'solid 1px #FFFFFF',
      backgroundColor: 'transparent',
      width: '40px',
      minWidth: '40px',
      height: '40px',
      borderRadius: '20px',
      marginRight: '20px',
      '& svg': {
        display: 'block',
        margin: '0 2px 0 8px',
      },
    },
    joinControls: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    link: {
      fontWeight: 600,
      fontSize: '14px',
      textDecoration: 'underline',
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
    },
  }
})

export default useStyles
