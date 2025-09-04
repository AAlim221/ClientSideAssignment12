import React, { useEffect, useState } from 'react';
import AxiosSecure from '../../../hooks/axiosSecure.js'; // Assuming AxiosSecure is a pre-configured Axios instance
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch stats and withdrawal requests on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the stats
        const statsResponse = await AxiosSecure.get('/api/admin/stats');
        setTotalWorkers(statsResponse.data.totalWorkers);
        setTotalBuyers(statsResponse.data.totalBuyers);
        setTotalCoins(statsResponse.data.totalCoins);
        setTotalPayments(statsResponse.data.totalPayments);

        // Fetch withdrawal requests
        const withdrawResponse = await AxiosSecure.get('/api/admin/withdraw-requests');
        setWithdrawRequests(withdrawResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePaymentSuccess = async (withdrawalId, userId, amount) => {
    try {
      const response = await AxiosSecure.post('/api/admin/payment-success', {
        withdrawalId,
        userId,
        amount,
      });

      if (response.status === 200) {
        alert('Payment approved successfully');
        // Re-fetch withdrawal requests to reflect changes
        const withdrawResponse = await AxiosSecure.get('/api/admin/withdraw-requests');
        setWithdrawRequests(withdrawResponse.data);
      }
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-200 p-4 rounded-lg text-center">
          <h3 className="font-bold">Total Workers</h3>
          <p>{totalWorkers}</p>
        </div>
        <div className="bg-green-200 p-4 rounded-lg text-center">
          <h3 className="font-bold">Total Buyers</h3>
          <p>{totalBuyers}</p>
        </div>
        <div className="bg-yellow-200 p-4 rounded-lg text-center">
          <h3 className="font-bold">Total Available Coins</h3>
          <p>{totalCoins}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-lg text-center">
          <h3 className="font-bold">Total Payments</h3>
          <p>{totalPayments}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-700 mb-4">Withdrawal Requests</h3>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {withdrawRequests.map((request) => (
            <tr key={request._id}>
              <td className="border px-4 py-2">{request.userId}</td>
              <td className="border px-4 py-2">{request.amount}</td>
              <td className="border px-4 py-2">{request.status}</td>
              <td className="border px-4 py-2">
                {request.status === 'pending' && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={() => handlePaymentSuccess(request._id, request.userId, request.amount)}
                  >
                    Payment Success
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
