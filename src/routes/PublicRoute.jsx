import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

const PublicRoute = ({ element }) => {
  const { user, loading } = UserAuth();

  if (loading) return null;

  return user ? <Navigate to="/profile" replace /> : element;
};

export default PublicRoute;