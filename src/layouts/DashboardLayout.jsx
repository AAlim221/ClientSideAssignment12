import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import AxiosSecure from '../hooks/axiosSecure';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated. Redirecting to login.");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch user role from backend (MongoDB)
  useEffect(() => {
    const fetchRole = async () => {
      try {
        console.log('Fetching role for user:', user?.email);

        if (!user?.email) {
          throw new Error("User email is missing");
        }

        const url = `/api/users/${user?.email}/role`;
        console.log(`Calling API: ${url}`);
        
        // Use AxiosSecure if it's a secure request
        const response = await AxiosSecure.get(url);

        if (response.status === 200 && response.data?.role) {
          setRole(response.data.role);
        } else {
          setError('Role data is missing in the response.');
          console.error('Error: Role data is missing in the response');
        }

        setRoleLoading(false);
      } catch (err) {
        console.error('Error fetching role:', err.message);
        setError(`Error fetching role data: ${err.message}`);
        setRoleLoading(false);
      }
    };

    if (user?.email) {
      fetchRole();
    } else {
      setError('User is not authenticated or missing email');
      setRoleLoading(false);
    }
  }, [user?.email]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Show loading message if role is loading
  if (roleLoading) {
    return <div>Loading role...</div>;
  }

  // Show error message if there's an error fetching the role
  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white p-2 mt-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  // Menu items based on role
  const menuItems = {
    Worker: [
      { label: 'Home', path: 'worker-home' },
      { label: 'Task List', path: 'task-list' },
      { label: 'My Submissions', path: 'my-submissions' },
      { label: 'Withdrawals', path: 'withdrawals' },
    ],
    Buyer: [
      { label: 'Home', path: 'buyer-home' },
      { label: 'Add New Tasks', path: 'add-task' },
      { label: 'My Tasks', path: 'my-tasks' },
      { label: 'Purchase Coin', path: 'purchase-coin' },
      { label: 'Payment History', path: 'payment-history' },
    ],
    Admin: [
      { label: 'Home', path: 'admin-home' },
      { label: 'Manage Users', path: 'manage-users' },
      { label: 'Manage Tasks', path: 'manage-tasks' },
    ],
  };

  const currentRole = role?.charAt(0).toUpperCase() + role?.slice(1);

  // Check if the role is valid
  if (!currentRole || !menuItems[currentRole]) {
    return <div>Invalid role. Please contact support.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="bg-gray-900 text-white w-full lg:w-64 p-6">
        <div className="text-2xl font-bold mb-6">MicroTask</div>
        <nav className="space-y-2">
          {(menuItems[currentRole] || []).map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${item.path}`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-blue-600' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-600 font-semibold">
              Coins: {user?.coin || 0}
            </span>
            <button className="text-gray-600 relative hover:text-blue-600">
              <FaBell size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-700 font-medium">{user?.displayName || 'User'}</div>
              <div className="text-sm text-gray-500">{role}</div>
            </div>
            <img
              src={user?.photoURL || 'https://i.ibb.co/5RjchBg/user.png'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <button
              onClick={handleLogout}
              className="ml-4 text-gray-600 hover:text-red-600"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white text-center py-4 shadow-inner text-gray-500 text-sm">
          © {new Date().getFullYear()} MicroTask | All rights reserved.
        </footer>
      </div>
    </div>
  );
}
