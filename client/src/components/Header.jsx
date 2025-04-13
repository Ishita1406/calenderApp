import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Profile from './Profile';
import "../styles/Header.css"

const Header = ({ userInfo }) => {

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="header-container">
      <h2 className="header-title">My Calendar</h2>
      <Profile userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Header