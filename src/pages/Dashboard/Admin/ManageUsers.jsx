import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../hooks/axiosSecure'; // Assuming axiosSecure is already set up

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosSecure.get('/api/admin/users');
        setUsers(response.data);  // Populate the users list
      } catch (error) {
        console.error('Error fetching users:', error);
        setStatusMessage('Error fetching users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId) => {
    try {
      const response = await axiosSecure.post('/api/admin/remove-user', { userId });
      if (response.status === 200) {
        setStatusMessage('User removed successfully');
        // Update users list to reflect the removal of the user
        setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      setStatusMessage('Error removing user. Please try again.');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await axiosSecure.post('/api/admin/update-role', { userId, newRole });
      if (response.status === 200) {
        setStatusMessage('User role updated successfully');
        // Update the role in the state to reflect the change in UI
        setUsers(prevUsers => 
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setStatusMessage('Error updating user role. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Users</h2>

      {statusMessage && <p className="text-red-600">{statusMessage}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Photo</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Coins</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">No users available</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <img src={user.profilePictureUrl || 'default-image.jpg'} alt={user.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      className="p-2 border rounded-md"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Worker">Worker</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{user.coins || 0}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      onClick={() => handleRemoveUser(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
