import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <div>
      <Nav/>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App