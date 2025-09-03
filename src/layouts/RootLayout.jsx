import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 
import { FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';

const RootLayout = () => {
  const { user, logOut } = useContext(AuthContext); // Destructure 'logOut' here
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut(); // Use 'logOut' here
      navigate('/'); // Navigate to the home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">MicroTasker</Link>

        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
              <a
                href="https://github.com/your-client-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <span className="text-gray-800 font-medium">Coins: {user?.coins || 0}</span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <a
                href="https://github.com/your-client-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Join as Developer
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold">MicroTasker</span>
          <div className="flex gap-4 text-2xl">
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-blue-500" />
            </a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="hover:text-blue-400" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-gray-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
