// src/pages/Dashboard/Worker/WorkerHome.jsx
import React, { useEffect, useState } from 'react';

function WorkerHome() {
  const [submissions, setSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Mocked API call for submissions
  useEffect(() => {
    // Normally, you would fetch data from an API
    const fetchData = async () => {
      const response = await fetch('/api/submissions');  // Replace with your real API endpoint
      const data = await response.json();
      setSubmissions(data);

      // Calculating total submissions, pending submissions, and total earnings
      const totalSubmissionsCount = data.length;
      const pendingCount = data.filter(submission => submission.status === 'pending').length;
      const earnings = data
        .filter(submission => submission.status === 'approved')
        .reduce((acc, submission) => acc + submission.payable_amount, 0);

      setTotalSubmissions(totalSubmissionsCount);
      setPendingSubmissions(pendingCount);
      setTotalEarnings(earnings);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700">Worker Dashboard</h2>
      
      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Submissions</h3>
          <p className="text-2xl text-blue-600">{totalSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800">Pending Submissions</h3>
          <p className="text-2xl text-yellow-600">{pendingSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Earnings</h3>
          <p className="text-2xl text-green-600">${totalEarnings}</p>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Approved Submissions</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Task Title</th>
              <th className="px-4 py-2 text-left border-b">Payable Amount</th>
              <th className="px-4 py-2 text-left border-b">Buyer Name</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.filter(submission => submission.status === 'approved').map((submission, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{submission.task_title}</td>
                <td className="px-4 py-2 border-b">${submission.payable_amount}</td>
                <td className="px-4 py-2 border-b">{submission.buyer_name}</td>
                <td className="px-4 py-2 border-b">{submission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkerHome;
