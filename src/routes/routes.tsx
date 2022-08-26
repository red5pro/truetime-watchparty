import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../pages/About/About'
import Signin from '../pages/SignIn/SignIn'
import Home from '../pages/Home/Home'
import Landing from '../pages/Landing/Landing'
import JoinPage from '../pages/JoinPage/JoinPage'
import MediaContext from '../components/MediaContext/MediaContext'
import JoinContext from '../components/JoinContext/JoinContext'
import WatchContext from '../components/WatchContext/WatchContext'
import VipJoinPage from '../pages/VipJoinPage/VipJoinPage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<About />} />
        <Route path="/login" element={<Signin />} />
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
        {/* WAT-70, WAT-73 */}
        <Route path="/join/guest" element={<VipJoinPage />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
