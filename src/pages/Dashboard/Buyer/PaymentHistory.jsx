// src/pages/Dashboard/Buyer/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the payment history for the logged-in buyer
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('/api/payment-history'); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError('Error fetching payment history');
        console.error(err);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Payment History</h2>

      {error && <p className="text-red-600">{error}</p>}

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">Payment ID</th>
            <th className="px-4 py-2 text-left border-b">Amount Paid</th>
            <th className="px-4 py-2 text-left border-b">Payment Date</th>
            <th className="px-4 py-2 text-left border-b">Payment Method</th>
            <th className="px-4 py-2 text-left border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.payment_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{payment.payment_id}</td>
                <td className="px-4 py-2 border-b">${payment.amount_paid}</td>
                <td className="px-4 py-2 border-b">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{payment.payment_method}</td>
                <td className="px-4 py-2 border-b">{payment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center border-b">
                No payment history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
