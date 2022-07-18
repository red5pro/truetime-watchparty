import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../pages/About/About'
import Home from '../pages/Home/Home'
import Room from '../pages/Room/Room'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<About />} />
      <Route path="/:room" element={<Room />} />
    </Routes>
  </BrowserRouter>
)

export default AppRoutes
