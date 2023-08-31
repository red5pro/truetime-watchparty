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
    rootContainer: {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      alignItems: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    mainVideo: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
    },
    content: {
      zIndex: 1,
    },
    organizerTopControls: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      maxHeight: '5rem',
      zIndex: 1,
    },
    topBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100vw',
    },
    webinarTopBar: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      // width: '86vw',
    },
    header: {
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
      position: 'absolute',
      width: '100vw',
      margin: 'unset',
      padding: 'unset',
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: 400,
      textAlign: 'center',
    },
    headerDivider: {
      height: '19px',
      width: '1px',
      borderLeft: '1px solid rgb(211, 211, 211, 0.3)',
      margin: '10px',
    },
    topControls: {
      justifyContent: 'flex-end',
      width: '100vw',
      maxWidth: 'unset',
      minWidth: 'unset',
      flexGrow: 'unset',
      flexBasis: 'unset',
    },
    bottomBar: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      left: 0,
      bottom: 0,
      padding: '0 15px 15px',
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '6rem',
    },
    layoutContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    moreButton: {
      margin: 'auto 15px',
    },
    chatInput: {
      width: '45%',
      maxWidth: '240px',
    },
    publishControls: {
      position: 'absolute',
      left: '24px',
    },
    partyControls: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      alignItems: 'center',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',

      '& label': {
        width: '32px',
        height: '32px',
      },
    },

    shareScreenButton: {
      width: 'fit-content !important',
      minWidth: 'fit-content',
      margin: 0,
      padding: '20px 10px',
    },
  }
})

export default useStyles
