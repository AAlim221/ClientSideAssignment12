import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, role, roleLoading } = useContext(AuthContext);

  // Log to see the role and loading state
  console.log('roleLoading:', roleLoading, 'role:', role, 'user:', user);

  // Show a loading state or fallback while fetching the role
  if (roleLoading) {
    return <div>Loading...</div>;
  }

  // Check if the user is authenticated and has the 'Admin' role
  if (!user || role !== 'Admin') {
    console.log('Access Denied: Redirecting to forbidden');
    return <Navigate to="/forbidden" />;
  }

  // If the user is authenticated and has the Admin role, render the children components
  console.log('Access Granted: Rendering children');
  return children;
}
