import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import defaultAvatar from '../assets/images/avatar-default.png';

function Profile() {
  const navigate = useNavigate();
  const { user } = UserAuth();

  return (
    <div>
      <img
        src={user.avatarUrl || defaultAvatar} // Use user's profile picture or default avatar
        alt="User Avatar"
        className="w-28 h-28 rounded-full"
        onMouseEnter={() => setIsOpen(true)}
      />
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{user.fullName || "Anonymous"}</h1>
      </div>
    </div>
  );
}

export default Profile;
