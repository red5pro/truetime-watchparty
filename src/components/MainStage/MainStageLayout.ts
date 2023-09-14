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
const base = {
  topBar: {},
  mainVideoContainer: {},
  mainVideo: {},
  publisherContainer: {},
  publisher: {},
  subscriberList: {},
  subscriberContainer: {},
  subscriber: {},
  subscriberVideo: {},
  vipContainer: {},
  vipsubscriber: {},
  vipsubscriberVideo: {},
}

const styles = {
  stage: {
    ...base,
    mainVideoContainer: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
    },
    mainVideoContainerWb: {
      zIndex: -100,
      position: 'absolute',
      width: 'calc(100vw - 14rem)',
      height: 'calc(100vh - 9rem)',
      top: '5rem',
      left: '13rem',
    },
    mainVideo: {
      width: '100%',
      height: '100%',
      borderRadius: 'unset',
    },
    publisherContainer: {
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      position: 'absolute',
      left: '24px',
      top: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      height: 'calc(100vh - 94px)',
      justifyContent: 'end',
      rowGap: '10px',
    },
    subscriberListWb: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      justifyContent: 'start',
      rowGap: '10px',
      width: '15%',
      minWidth: '10rem',
    },
    subscriberListAnon: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      height: 'calc(100vh - 24px)',
      justifyContent: 'start',
      rowGap: '10px',
      width: 'fit-content',
    },
    subscriberListWbAnon: {
      // position: 'absolute',
      // left: '24px',
      // top: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      height: 'calc(100vh - 24px)',
      justifyContent: 'start',
      rowGap: '10px',
      width: 'fit-content',
    },
    subscriberContainer: {
      display: 'flex',
      // overflowY: 'scroll',
      // flexGrow: 9,
      flexDirection: 'column',
      aspectRatio: '0.25',
      paddingRight: '20px',
      alignItems: 'center',
      height: '100%',
      rowGap: '10px',
      minWidth: '100% !important',
      paddingLeft: '20px',
      paddingTop: '20px',
      boxSizing: 'border-box',
    },
    subscriberItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subscriber: {
      maxHeight: '124px',
      flexGrow: 1,
      height: '100%',
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
    },
    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
    },
    vipsubscriber: {
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
  fullscreen: {
    ...base,
    mainVideoContainer: {
      position: 'absolute',
      right: 24,
      bottom: 86,
      height: '250px',
      maxWidth: '390px',
      zIndex: -100,
    },
    mainVideoContainerWb: {
      zIndex: -100,
      position: 'relative',
      height: '1px',
      maxWidth: '1px',
      top: '4rem',
      left: '50%',
    },
    mainVideo: {
      width: '100%',
      height: '100%',
      borderRadius: '20px',
    },
    publisherContainer: {
      position: 'absolute',
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      position: 'absolute',
      width: '100%',
      height: 'calc(100vh - 480px)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    subscriberListWb: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      maxHeight: 'calc(100vh - 9rem)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      top: '4rem',
      maxWidth: '90%',
      padding: '15px',
    },
    subscriberListAnon: {
      position: 'absolute',
      width: '100%',
      height: 'calc(100vh - 480px)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      top: '5rem',
    },
    subscriberListWbAnon: {
      position: 'absolute',
      width: '100%',
      height: 'calc(100vh - 10rem)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      top: '5rem',
    },
    subscriberContainer: {
      padding: '0 48px',
      display: 'grid',
      gridGap: '20px',
      width: '100%',
      // gridTemplateRows: 'calc((100% / 2)) calc((100% / 2))',
      gridTemplateColumns:
        'calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px) calc((100% / 4) - 12px)',
      height: '100%',
      marginTop: '0!important',
      justifyContent: 'center',
    },
    subscriberContainerFull: {
      gap: '10px',
      justifyContent: 'center',
      overflow: 'hidden',
      width: '100%',
    },
    subscriberItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subscriber: {
      height: '100%',
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
      padding: '0 !important',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
    },
    publisherVideo: {
      height: '100%',
      borderRadius: '20px',
      backgroundColor: 'black',
      aspectRatio: '1 / 1',
    },
    vipContainer: {
      position: 'absolute',
      bottom: '80px',
      left: '24px',
    },
    vipsubscriber: {
      height: '250px',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
  empty: {
    ...base,
    topBar: {
      // display: 'none!important',
    },
    mainVideoContainerWb: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: -100,
      backgroundColor: 'black',
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
    publisherContainer: {
      bottom: '73px',
      left: '24px',
      width: '176px',
      height: '176px',
    },
    publisher: {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    },
    subscriberList: {
      opacity: 0.3,
      position: 'absolute',
      left: '24px',
      top: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      height: 'calc(100vh - 94px)',
      justifyContent: 'end',
      rowGap: '10px',
    },
    subscriberListWb: {
      opacity: 0.3,
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      // height: 'calc(100vh - 94px)',
      justifyContent: 'end',
      rowGap: '10px',
      zIndex: '-200',
    },
    subscriberContainer: {
      display: 'flex',
      overflowY: 'auto',
      // flexGrow: 9,
      flexDirection: 'column',
      width: '144px',
      aspectRatio: '0.25',
      paddingRight: '20px',
      alignItems: 'center',
      height: '100%',
      rowGap: '10px',
    },
    subscriber: {
      maxHeight: '124px',
      flexGrow: 1,
      height: '100%',
      borderRadius: '20px',
      // backgroundColor: 'black',
      width: '100%',
    },
    subscriberVideo: {
      borderRadius: '20px',
      backgroundColor: 'black',
      width: '100%',
    },
    vipContainer: {
      position: 'absolute',
      right: '24px',
      top: '80px',
    },
    vipsubscriber: {
      height: 'calc(100vh / 3)',
      aspectRatio: '1 / 1',
    },
    vipsubscriberVideo: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: '20px',
    },
  },
}

export default styles
