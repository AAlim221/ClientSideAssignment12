import React, { useEffect, useState } from 'react';

function WorkerHome() {
  const [submissions, setSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  // Mocked API call for submissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
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
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Worker Dashboard</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800">Total Submissions</h3>
          <p className="text-2xl text-blue-600">{loading ? 'Loading...' : totalSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800">Pending Submissions</h3>
          <p className="text-2xl text-yellow-600">{loading ? 'Loading...' : pendingSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800">Total Earnings</h3>
          <p className="text-2xl text-green-600">{loading ? 'Loading...' : `$${totalEarnings.toFixed(2)}`}</p>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Approved Submissions</h3>
        {loading ? (
          <div className="text-center text-gray-500">Loading approved submissions...</div>
        ) : (
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Task Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payable Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Buyer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions
                .filter(submission => submission.status === 'approved')
                .map((submission, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.task_title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${submission.payable_amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.buyer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WorkerHome;
