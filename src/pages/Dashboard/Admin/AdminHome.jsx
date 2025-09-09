import React, { useState, useEffect } from 'react';
import AxiosSecure from '../../../hooks/axiosSecure'; // Assuming AxiosSecure is a pre-configured Axios instance

export default function AdminHome() {
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0); 
  const [totalPayments, setTotalPayments] = useState(0);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await AxiosSecure.get('/api/admin/users');
        if (statsResponse.data) {
          const usersData = statsResponse.data.users; 
          const totalWorkers = usersData.filter(user => user.role === 'worker').length;
          const totalBuyers = usersData.filter(user => user.role === 'buyer').length;
          setTotalWorkers(totalWorkers);
          setTotalBuyers(totalBuyers);

          const totalCoins = usersData
            .filter(user => user.role !== 'admin') 
            .reduce((acc, user) => acc + (user.coins || 0), 0);
          setTotalCoins(totalCoins); 

          setTotalPayments(usersData.reduce((acc, user) => acc + (user.payments || 0), 0)); 
        }

        fetchWithdrawRequests();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchWithdrawRequests = async () => {
    try {
      const withdrawResponse = await AxiosSecure.get('/api/admin/withdraw-requests');
      setWithdrawRequests(withdrawResponse.data.filter((request) => request.status === 'pending'));
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    }
  };

 const handlePaymentSuccess = async (withdrawalId, workerEmail, amount, withdrawalCoin) => {
    try {
        setActionLoading(true); // Disable the button during action
        console.log('Sending payment success:', { withdrawalId, workerEmail, amount, withdrawalCoin });

        // Send the payment success request with the correct data
        const response = await AxiosSecure.post('/api/admin/payment-success', {
            withdrawalId,
            userId: workerEmail,  // Ensure the workerEmail is passed as userId
            amount,
            paymentInfo: {
                transactionId: 'TXN12345',  // Example transaction ID (can be dynamic)
                paymentMethod: 'Nagad',     // Example payment method
            },
        });

        if (response.status === 200) {
            // Update the withdraw request status to "Payment Done" immediately in the UI
            setWithdrawRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === withdrawalId
                        ? { ...request, status: 'payment done' } // Update status to "payment done"
                        : request
                )
            );

            alert('Payment approved and recorded successfully.');
        }
    } catch (error) {
        console.error('Error approving payment:', error.response || error);
    } finally {
        setActionLoading(false); // Re-enable the button
    }
};


  return (
    <div className="p-6 text-black">
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

      <h3 className="text-xl font-bold text-gray-700 mb-4">Pending Withdrawal Requests</h3>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Worker Name</th>
                <th className="border px-4 py-2">Withdrawal Coins</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Payment System</th>
                <th className="border px-4 py-2">Account Number</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">No pending requests found</td>
                </tr>
              ) : (
                withdrawRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="border px-4 py-2">{request.worker_name}</td>
                    <td className="border px-4 py-2">{request.withdrawal_coin}</td> 
                    <td className="border px-4 py-2">${request.withdrawal_amount}</td>
                    <td className="border px-4 py-2">{request.payment_system}</td>
                    <td className="border px-4 py-2">{request.account_number}</td>
                    <td className="border px-4 py-2">
                      {new Date(request.withdraw_date).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      {request.status === 'payment done' ? (
                        <button className="bg-gray-400 text-white px-4 py-2 rounded-md" disabled>
                          Payment Done
                        </button>
                      ) : (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                          onClick={() =>
                            handlePaymentSuccess(request._id, request.worker_email, request.withdrawal_amount, request.withdrawal_coin)
                          }
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Processing...' : 'Approve Payment'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
