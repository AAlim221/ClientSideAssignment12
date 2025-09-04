import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import AxiosSecure from '../hooks/axiosSecure';


export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [coin, setCoin] = useState(0); // Added state for coin
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated. Redirecting to login.");
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch role and coin data
 useEffect(() => {
  const fetchRoleAndCoins = async () => {
    try {
      console.log('Fetching role and coins for user:', user?.email);

      if (!user?.email) {
        throw new Error("User email is missing");
      }

      const url = `/api/users/${user?.email}/role`;
      console.log(`Calling API: ${url}`);

      // Fetch user role and coin data
      const response = await AxiosSecure.get(url);

      // Log full response details for debugging
      console.log('API Response:', response);

      // Log the data part of the response
      console.log('API Response Data:', response.data);

      // Ensure that the response contains the correct data
      if (response.status === 200 && response.data?.role) {
        setRole(response.data.role);
        
        // Check if coin exists in the response
        if (response.data?.coin !== undefined) {
          setCoin(response.data.coin);  // Update coin value in the state
          console.log("Updated coin value:", response.data.coin);  // Log the updated coin value
        } else {
          setError('Coins data is missing in the response');
        }
      } else {
        setError('Role data is missing in the response.');
        console.error('Error: Role data is missing in the response');
      }

      setRoleLoading(false);
    } catch (err) {
      console.error('Error fetching role:', err.message);
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
  if (logout) {
    try {
      await logout(); // Attempt logout
      navigate('/login'); // Redirect to login after successful logout
    } catch (err) {
      console.error("Logout failed:", err);
      setError('Logout failed. Please try again later.');
    }
  } else {
    console.error("Logout function is not available.");
    setError('Logout function is not available.');
  }
};


  // Loading state
  if (roleLoading) {
    return <div>Loading role...</div>;
  }

  // Error handling state
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

  // Check for valid role
  if (!currentRole || !menuItems[currentRole]) {
    return <div>Invalid role. Please contact support.</div>;
  }

  // Debugging the coin state
  console.log("Current coin value:", coin);

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
