import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../pages/About/About'
import Home from '../pages/Home/Home'
import PublishEvent from '../pages/PublishEvent/PublishEvent'
import SubscribeEvent from '../pages/SubscribeEvent/SubscribeEvent'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<About />} />
      <Route path="/create" element={<PublishEvent />} /> {/** Publish a new event */}
      <Route path="/:room" element={<SubscribeEvent />} /> {/** Subscribe to an event */}
      <Route path="/:room/:stream" element={<SubscribeEvent />} /> {/** Subscribe to an event */}
    </Routes>
  </BrowserRouter>
)

export default AppRoutes
