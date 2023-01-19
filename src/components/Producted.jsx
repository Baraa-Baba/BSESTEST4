import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/AuthContext';

const Protected = ({ children }) => {
  const { user } = useUserAuth();
  if (!user) {
    return <Navigate to='/sign-in' />;
  }

  return children;
};

export default Protected;