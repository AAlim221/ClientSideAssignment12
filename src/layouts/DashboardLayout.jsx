import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook for Firebase auth
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import AxiosSecure from '../hooks/axiosSecure';

export default function DashboardLayout() {
  const { user, logOut } = useAuth(); // Make sure it’s 'logOut' from AuthContext
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [coin, setCoin] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated. Redirecting to login.");
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchRoleAndCoins = async () => {
      try {
        if (!user?.email) {
          throw new Error("User email is missing");
        }

        const url = `/api/users/${user?.email}/role`;
        const response = await AxiosSecure.get(url);

        if (response.status === 200 && response.data?.role) {
          setRole(response.data.role);
          if (response.data?.coin !== undefined) {
            setCoin(response.data.coin);
          } else {
            setError('Coins data is missing in the response');
          }
        } else {
          setError('Role data is missing in the response.');
        }

        setRoleLoading(false);
      } catch (err) {
        setError(`Error fetching role and coin data: ${err.message}`);
        setRoleLoading(false);
      }
    };

    if (user?.email) {
      fetchRoleAndCoins();
    } else {
      setError('User is not authenticated or missing email');
      setRoleLoading(false);
    }
  }, [user?.email]);

  const handleLogout = async () => {
    try {
      await logOut(); // Ensure 'logOut' function is available from useAuth
      navigate('/login'); // Redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
      setError('Logout failed. Please try again later.');
    }
  };

  if (roleLoading) {
    return <div>Loading...</div>;
  }

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

  // Menu Items Based on Role
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
      { label: 'My Tasks', path: `my-tasks/${user?.uid}` },
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

  if (!currentRole || !menuItems[currentRole]) {
    return <div>Invalid role. Please contact support.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-600 font-semibold">
              Coins: {coin !== undefined ? coin : 'Loading...'}
            </span>
            <button className="text-gray-600 relative hover:text-blue-600">
              <FaBell size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-700 font-medium">{user?.name || 'User'}</div>
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

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="bg-white text-center py-4 shadow-inner text-gray-500 text-sm">
          © {new Date().getFullYear()} MicroTask | All rights reserved.
        </footer>
      </div>
    </div>
  );
}
