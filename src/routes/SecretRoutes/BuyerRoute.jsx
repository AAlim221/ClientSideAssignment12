import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const BuyerRoute = ({ children }) => {
  const { user, role, roleLoading } = useContext(AuthContext);

  // Show loading while role is being fetched
  if (roleLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated or doesn't have the "Buyer" role, redirect to forbidden page
  if (!user || role !== 'Buyer') {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default BuyerRoute;
