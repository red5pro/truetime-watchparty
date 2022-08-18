import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../pages/About/About'
import Signin from '../pages/SignIn/SignIn'
import Home from '../pages/Home/Home'
import Landing from '../pages/Landing/Landing'
import JoinPage from '../pages/JoinPage/JoinPage'
import PublishEvent from '../pages/PublishEvent/PublishEvent'
import MainStagePage from '../pages/MainStagePage/MainStagePage'
import VipJoinPage from '../pages/VipJoinPage/VipJoinPage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<About />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/create" element={<PublishEvent />} /> {/** Publish a new event */}
        <Route path="/join/:token" element={<JoinPage />} /> {/* WAT-70, WAT-73 */}
        <Route path="/main/:token" element={<MainStagePage />} /> {/* WAT-74 */}
        <Route path="/join/guest" element={<VipJoinPage />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
