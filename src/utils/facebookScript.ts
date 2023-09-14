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
import { FACEBOOK_APP_ID } from '../settings/variables'

export const loadFBScriptAsyncronously = (callback: (value: boolean) => void) => {
  let rootElem = document.getElementById('fb-root')
  if (!rootElem) {
    rootElem = document.createElement('div')
    rootElem.id = 'fb-root'
    document.body.appendChild(rootElem)
  }

  //TODO: CHANGE THIS TO USE GEO LOC
  const location = 'en_US'

  const script = document.createElement('script')
  script.id = 'facebook-jssdk'
  script.src = `https://connect.facebook.net/${location}/sdk.js#xfbml=1&version=v14.0`
  script.nonce = 'Pv4Itb3k'
  script.async = true
  script.defer = true
  script.crossOrigin = 'anonymous'

  document.body.appendChild(script)
  script.onload = () => {
    if (callback) {
      callback(true)

      window.FB.init({
        appId: FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.6',
        cookie: true,
        status: true,
      })
    }
  }

  script.onerror = () => {
    loadFBScriptAsyncronously(callback)
  }
}
