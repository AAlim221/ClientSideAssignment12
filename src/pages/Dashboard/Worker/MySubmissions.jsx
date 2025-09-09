import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import AxiosSecure from '../../../hooks/axiosSecure'; // Use AxiosSecure for API calls

function WorkerWithdrawals() {
  const { user, loading: authLoading } = useAuth(); // Use authentication loading state from useAuth hook
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure user is authenticated before fetching withdrawals
    if (!user) {
      setError('User is not authenticated');
      setLoadingData(false);
      return;
    }

    const fetchWithdrawals = async () => {
      try {
        setLoadingData(true); // Set loading state while fetching data
        const response = await AxiosSecure.get(`/api/withdrawals/${user.email}`); // Use AxiosSecure to fetch withdrawals

        console.log('Response Status:', response.status); // Log status code
        console.log('Response Data:', response.data); // Log response data

        if (response.status === 200) {
          setWithdrawals(response.data.withdrawals); // Assuming the response contains a 'withdrawals' array
        } else {
          throw new Error('Failed to fetch withdrawals');
        }
      } catch (err) {
        setError(`Error fetching withdrawals: ${err.message}`);
        console.error('Error fetching withdrawals:', err); // Log the complete error
      } finally {
        setLoadingData(false); // Set loading to false after data is fetched
      }
    };

    fetchWithdrawals();
  }, [user]); // Re-run effect when `user` changes (i.e., when user is logged in)

  // Function to highlight status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (authLoading || loadingData) {
    return <div>Loading...</div>; // Show loading state if data is being fetched
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message if data fetching fails
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Your Withdrawals</h2>

      {withdrawals.length === 0 ? (
        <div className="text-center text-gray-500">No withdrawals found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Withdrawal Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount ($)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment System</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Account Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(withdrawal.withdraw_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${withdrawal.withdrawal_amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{withdrawal.payment_system}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{withdrawal.account_number}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WorkerWithdrawals;
