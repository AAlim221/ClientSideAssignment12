import React, { useEffect, useState } from 'react';

function WorkerSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const workerEmail = "worker@example.com"; // Replace with the actual logged-in worker email

  // Fetch data for submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const response = await fetch('/api/submissions'); // Replace with your actual API endpoint
      const data = await response.json();
      // Filter submissions where workerEmail matches the logged-in worker
      const filteredSubmissions = data.filter(submission => submission.workerEmail === workerEmail);
      setSubmissions(filteredSubmissions);
      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  // Function to highlight status
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Your Submissions</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading submissions...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Task Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Buyer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submission Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payable Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{submission.task_title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{submission.buyer_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{submission.submission_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${submission.payable_amount}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${getStatusColor(submission.status)}`}>
                    {submission.status}
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

export default WorkerSubmissions;
