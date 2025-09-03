import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const WorkerRoute = ({ children }) => {
  const { user, role, roleLoading } = useContext(AuthContext);

  // Show loading state while role data is being fetched
  if (roleLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated or doesn't have the "Worker" role, redirect to forbidden page
  if (!user || role !== 'Worker') {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default WorkerRoute;
