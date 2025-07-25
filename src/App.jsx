import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Admin from './components/Admin'
import NotFound from './components/NotFound'
import Redirect from './components/Redirect'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <div>
      <Nav/>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:shortCode" element={<Redirect />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App