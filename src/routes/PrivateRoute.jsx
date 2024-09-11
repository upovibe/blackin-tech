import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = UserAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/signin" replace />;
  }

  if (!user.role || user.role.trim() === "") {
    // If no role, stay on the profile page or redirect to it
    if (location.pathname !== "/profile") {
      return <Navigate to="/profile" replace />;
    }
    // Allow rendering profile if already on profile page
    return <Outlet />;
  }

  // Redirect user to profile if trying to access dashboard
  if (user.role === "user" && location.pathname === "/dashboard") {
    return <Navigate to="/profile" replace />;
  }

  // If user and role exist, allow navigation
  return <Outlet />;
};

export default PrivateRoute;
