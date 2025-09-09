import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth'; // Custom hook to get authenticated user
import AxiosSecure from '../../../hooks/axiosSecure'; // Use AxiosSecure for API calls

function WorkerHomePage() {
  const { user, loading: authLoading } = useAuth(); // Use authentication loading state from useAuth hook
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalPendingWithdrawals, setTotalPendingWithdrawals] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure user is authenticated before fetching data
    if (!user) {
      setError('User is not authenticated');
      setLoadingData(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true); // Set loading state while fetching data

        // Fetch worker's total withdrawals, pending withdrawals count, and total earnings
        const workerHomeDataResponse = await AxiosSecure.get(`/api/worker-home/${user.email}`);
        if (workerHomeDataResponse.status === 200) {
          const { totalWithdrawals, totalPendingWithdrawals, withdrawals } = workerHomeDataResponse.data;
          
          // Sum the amount of approved withdrawals for total earnings
          const totalEarningsFromWithdrawals = withdrawals
            .filter(withdrawal => withdrawal.status === 'approved') // Filter only approved withdrawals
            .reduce((acc, withdrawal) => acc + withdrawal.withdrawal_amount, 0); // Sum the withdrawal amounts

          setTotalWithdrawals(totalWithdrawals);
          setTotalPendingWithdrawals(totalPendingWithdrawals);
          setTotalEarnings(totalEarningsFromWithdrawals);
          setWithdrawals(withdrawals);
        } else {
          throw new Error('Failed to fetch worker home data');
        }
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoadingData(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [user]); // Re-run effect when `user` changes (i.e., when user is logged in)

  if (authLoading || loadingData) {
    return <div>Loading...</div>; // Show loading state if data is being fetched
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message if data fetching fails
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Worker Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Withdrawals</h3>
          <p className="text-xl text-gray-900">{totalWithdrawals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Pending Withdrawals</h3>
          <p className="text-xl text-gray-900">{totalPendingWithdrawals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Earnings ($)</h3>
          <p className="text-xl text-gray-900">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mb-4">Approved Withdrawals</h3>

      {withdrawals.length === 0 ? (
        <div className="text-center text-gray-500">No approved withdrawals found.</div>
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
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(withdrawal.withdrawal_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${withdrawal.withdrawal_amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{withdrawal.payment_system}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{withdrawal.account_number}</td>
                  <td className={`px-6 py-4 text-sm text-gray-700 ${withdrawal.status === 'approved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
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

export default WorkerHomePage;
