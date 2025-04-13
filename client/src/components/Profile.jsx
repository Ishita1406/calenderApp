import React from 'react'
import { getInitials } from '../utils/errorHandler';
import "../styles/Profile.css"

const Profile = ({ userInfo, onLogout }) => {  

  if (!userInfo) {
    return (
      <div></div> 
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-avatar">
        {getInitials(userInfo?.name)}
      </div>
      <div className="profile-info">
        <p className="profile-name">{userInfo.name}</p>
        <button className="profile-logout" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Profile