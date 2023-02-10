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
