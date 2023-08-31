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
import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MediaContext from '../components/MediaContext/MediaContext'
import JoinContext from '../components/JoinContext/JoinContext'
import WatchContext from '../components/WatchContext/WatchContext'

import JoinWebinarPage from '../pages/JoinWebinarPage/JoinWebinarPage'
import JoinPage from '../pages/JoinPage/JoinPage'
import ThankYouPage from '../pages/ThankYouPage/ThankYouPage'
import Landing from '../pages/Landing/Landing'

import { isWatchParty } from '../settings/variables'
import { Paths } from '../utils/commonUtils'

const Signin = React.lazy(() => import('../pages/SignIn/SignIn'))
const Home = React.lazy(() => import('../pages/Home/Home'))
const VipJoinPage = React.lazy(() => import('../pages/VipJoinPage/VipJoinPage'))
const PartyEndedPage = React.lazy(() => import('../pages/PartyEndedPage/PartyEndedPage'))
const SimpleVipPage = React.lazy(() => import('../pages/SimpleVipPage/SimpleVipPage'))
const VerifyEmailPage = React.lazy(() => import('../pages/VerifyEmailPage/VerifyEmailPage'))
const Loading = React.lazy(() => import('../components/Common/Loading/Loading'))
const AdminPage = React.lazy(() => import('../pages/Admin/AdminPage'))

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route
            path="/join/:token"
            element={
              <JoinContext.Provider>
                <MediaContext.Provider>
                  <WatchContext.Provider>{isWatchParty ? <JoinPage /> : <JoinWebinarPage />}</WatchContext.Provider>
                </MediaContext.Provider>
              </JoinContext.Provider>
            }
          />
          <Route
            path={`${Paths.ANONYMOUS}/:token`}
            element={
              <JoinContext.Provider>
                <MediaContext.Provider>
                  <WatchContext.Provider>{isWatchParty ? <JoinPage /> : <JoinWebinarPage />}</WatchContext.Provider>
                </MediaContext.Provider>
              </JoinContext.Provider>
            }
          />
          {/* WAT-70, WAT-73 */}
          <Route path="/join/guest" element={<VipJoinPage />} />
          <Route
            path="/thankyou/:token"
            element={
              <JoinContext.Provider>
                <ThankYouPage />
              </JoinContext.Provider>
            }
          />
          <Route
            path={`${Paths.ANONYMOUS_THANKYOU}/:token`}
            element={
              <JoinContext.Provider>
                <ThankYouPage />
              </JoinContext.Provider>
            }
          />
          <Route
            path="/partyended/:token"
            element={
              <JoinContext.Provider>
                <PartyEndedPage />
              </JoinContext.Provider>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Landing />} />
          {/* TODO: Remove for production. Here for simple VIP entrance in demos. */}
          <Route path="/vip" element={<SimpleVipPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default AppRoutes
