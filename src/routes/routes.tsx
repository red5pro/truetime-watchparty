import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Signin from '../pages/SignIn/SignIn'
import Home from '../pages/Home/Home'
import Landing from '../pages/Landing/Landing'
import JoinPage from '../pages/JoinPage/JoinPage'
import MediaContext from '../components/MediaContext/MediaContext'
import JoinContext from '../components/JoinContext/JoinContext'
import WatchContext from '../components/WatchContext/WatchContext'
import VipJoinPage from '../pages/VipJoinPage/VipJoinPage'
import ThankYouPage from '../pages/ThankYouPage/ThankYouPage'
import PartyEndedPage from '../pages/PartyEndedPage/PartyEndedPage'
import SimpleVipPage from '../pages/SimpleVipPage/SimpleVipPage'
import AdminPage from '../pages/Admin/AdminPage'
import VerifyEmailPage from '../pages/VerifyEmailPage/VerifyEmailPage'
import VODHLSContext from '../components/VODHLSContext/VODHLSContext'
import { RecoilRoot } from 'recoil'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route
            path="/join/:token"
            element={
              <JoinContext.Provider>
                <MediaContext.Provider>
                  <WatchContext.Provider>
                    <JoinPage />
                  </WatchContext.Provider>
                </MediaContext.Provider>
              </JoinContext.Provider>
            }
          />
          {/* VOD */}
          <Route
            path="/join/vod/:token"
            element={
              <JoinContext.Provider>
                <MediaContext.Provider>
                  <WatchContext.Provider>
                    <VODHLSContext.Provider>
                      <JoinPage />
                    </VODHLSContext.Provider>
                  </WatchContext.Provider>
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
      </RecoilRoot>
    </BrowserRouter>
  )
}

export default AppRoutes
