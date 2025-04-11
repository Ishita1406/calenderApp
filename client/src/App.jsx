import React from 'react'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import "./styles/Login.css"
import SignUp from './pages/SignUp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
