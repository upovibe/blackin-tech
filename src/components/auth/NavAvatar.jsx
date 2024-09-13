import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/authService';
import { FaUser, FaCog, FaSignOutAlt, FaBriefcase } from 'react-icons/fa';
import { FaGauge } from 'react-icons/fa6';
import defaultAvatar from '../../assets/images/avatar-default.png';
import Divider from '../common/Divider';
import Modal from '../common/Modal';
import JobForm from '../forms/JobForm';

const NavAvatar = () => {
  const { user } = UserAuth();
  const [isOpen, setIsOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/signin');
    } else {
      console.error(result.message);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <img
        src={user.avatarUrl || defaultAvatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all duration-300"
        onClick={handleClick}
        onMouseEnter={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-14 flex flex-col gap-5 right-0 mt-2 w-max md:w-80 bg-white shadow-lg rounded-lg p-4 md:p-8 border border-gray-200 transition-all duration-300"
        >
          <div className="flex flex-col items-center space-y-2 mb-2 cursor-pointer" onClick={handleClick}>
            <img
              src={user.avatarUrl || defaultAvatar}
              alt="User Profile Pic"
              className="w-[80px] h-[80px] rounded-full"
            />
            <span className="text-sm font-medium">{user.fullName || "User Name"}</span>
          </div>
          <ul className="space-y-2">
            {/* Conditionally render the Apply for Job link if the user is not an admin */}
            {user.role !== 'admin' && (
              <li>
                <Link to="/jobs"
                  className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg text-slate-700"
                >
                  <FaUser /> <span>Apply for Job</span>
                </Link>
              </li>
            )}
            {user.role === 'admin' && (
            <li>
              <button
                className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg text-slate-700"
                onClick={handleModalOpen}
              >
                <FaBriefcase /> <span>Post Job</span>
              </button>
            </li>
            )}
            <li>
              <Link to="/settings"
                className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg text-slate-700"
              >
                <FaCog /> <span>Settings</span>
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/dashboard"
                  className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg text-slate-700"
                >
                  <FaGauge /> <span>Dashboard</span>
                </Link>
              </li>
            )}
            <Divider direction="horizontal" className="my-2 opacity-50" />
            <li>
              <button
                className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded-lg text-slate-700"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Post a Job">
        <JobForm/>
      </Modal>
    </div>
  );
};

export default NavAvatar;
