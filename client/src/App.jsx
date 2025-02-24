import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route,BrowserRouter } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import RecipeSearch from './pages/RecipeSearch'
import Favorites from './pages/Favorites'
import RecipeDetails from './pages/RecipeDetails'

function App() {
  

  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
       <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<RecipeSearch />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/recipes/:id" element={<RecipeDetails />} />



    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
