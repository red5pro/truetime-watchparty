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
import { AccountCredentials } from '../models/AccountCredentials'
import { WebbAppMode } from '../utils/variableUtils'

export const USE_LOCAL_SERVICES = false
export const DEFAULT_ORIGIN_ACCESS_TOKEN = 'abc123'

export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost'
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || 'localhost'
export const MAIN_ENDPOINT = `https://${API_SERVER_HOST}/conference-api/1.0`
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'ADDME'
export const RECAPTCHA_SECRET_KEY = process.env.REACT_APP_RECAPTCHA_SECRET_KEY || 'ADDME'

export const SM_ACCESS_TOKEN = process.env.REACT_APP_SM_TOKEN || ''
export const USE_CLOUD_STORAGE = process.env.REACT_APP_SM_CLOUDSTORAGE === '1' || false
export const USE_STREAM_MANAGER = process.env.REACT_APP_SM === '0' ? false : true
export const PREFER_WHIP_WHEP = process.env.REACT_APP_PREFER_WHIP_WHEP === '0' ? false : true

export const API_SOCKET_HOST = USE_LOCAL_SERVICES
  ? 'ws://localhost:8001'
  : `wss://${API_SERVER_HOST}/conference-api/1.0/ws/conference`
export const STREAM_HOST = USE_LOCAL_SERVICES ? 'localhost' : SERVER_HOST

export const DEFAULT_CONSTRAINTS = {
  audio: true,
  video: true,
}
export const FORCE_LIVE_CONTEXT = true
export const ENABLE_MUTE_API = true
export const ENABLE_DEBUG_UTILS = true

export const PUBLISH_API_KEY = process.env.REACT_APP_PUBLISH_API_KEY
export const SUBSCRIBE_API_KEY = process.env.REACT_APP_SUBSCRIBE_API_KEY
export const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID

const WEBAPP_MODE = process.env.REACT_APP_WEBAPP_MODE || WebbAppMode.WATCHPARTY

export const isWatchParty = WEBAPP_MODE === WebbAppMode.WATCHPARTY
export const adminAccount: AccountCredentials = {
  email: process.env.REACT_APP_ADMIN_USER,
  password: process.env.REACT_APP_ADMIN_PASS,
}
