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
    avSetup: {
      position: 'relative',
      top: -50,

      '& > div': {
        marginTop: '3rem',
      },

      [theme.breakpoints.down('sm')]: {
        '& > div': {
          margin: '0 12px',
        },

        '& video': {
          width: '100%',
        },
      },
    },
    container: {
      width: '25rem',
      borderRadius: '20px',
      background: '#303030 60%',
      padding: '32px',

      [theme.breakpoints.down('sm')]: {
        width: '75%',
        marginBottom: '16px',
        flexDirection: 'column',
      },
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
    },
    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
    header: {
      width: '100%',
      position: 'absolute',
      top: 20,
      zIndex: 0,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
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
    loadingContainer: {
      alignItems: 'center',
      marginTop: '10%',
      zIndex: 200,
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
    subscriberList: {
      position: 'absolute',
      left: '24px',
      top: '6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'calc(100vh - 12px)',
    },
    subscriberContainer: {
      display: 'flex',
      flexDirection: 'column',
      // width: '144px',
      aspectRatio: '0.25',
      margin: '20px 0',
      paddingRight: '20px',
      alignItems: 'center',
      height: '100%',
      rowGap: '10px',
    },
    subscriber: {
      maxHeight: '124px',
      flexGrow: 1,
      height: '100%',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
    },
    participantsLoading: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0.2rem 0.2rem 0.1rem #000)',
    },
  }
})

export default useStyles
