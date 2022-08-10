import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../pages/About/About'
import Home from '../pages/Home/Home'
import Landing from '../pages/Landing/Landing'
import PublishEvent from '../pages/PublishEvent/PublishEvent'
import Room from '../pages/Room/Room'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/404" element={<Landing />} />
      <Route path="/faq" element={<About />} />
      <Route path="/create" element={<PublishEvent />} /> {/** Publish a new event */}
      <Route path="/:room" element={<Room />} /> {/** Subscribe to an event */}
    </Routes>
  </BrowserRouter>
)

export default AppRoutes
