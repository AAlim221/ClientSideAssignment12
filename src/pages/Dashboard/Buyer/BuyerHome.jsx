// src/pages/Dashboard/Buyer/BuyerHome.jsx
import React, { useState, useEffect } from 'react';

function BuyerHome() {
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tasks created by the buyer
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Fetch tasks from API
        const data = await response.json();
        setTotalTaskCount(data.length);

        const pendingTasks = data.reduce((sum, task) => sum + task.required_workers, 0);
        const payment = data.reduce((sum, task) => sum + task.payable_amount, 0);

        setPendingTaskCount(pendingTasks);
        setTotalPayment(payment);
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      }
    };

    // Fetch submissions for the buyer's tasks with status "pending"
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions?status=pending'); // Fetch submissions with "pending" status
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError('Failed to load submissions');
        console.error(err);
      }
    };

    fetchTasks();
    fetchSubmissions();
  }, []);

  // Handle approving a submission
  const handleApprove = async (submissionId) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/approve`, { // Replace with your endpoint
        method: 'PUT',
      });

      if (response.ok) {
        setSubmissions(submissions.map(submission =>
          submission._id === submissionId
            ? { ...submission, status: 'approved' }
            : submission
        ));
        alert('Submission approved');
      } else {
        alert('Error approving submission');
      }
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  // Handle rejecting a submission
  const handleReject = async (submissionId, taskId) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/reject`, { // Replace with your endpoint
        method: 'PUT',
      });

      if (response.ok) {
        // Increase required_workers for the task by 1
        await fetch(`/api/tasks/${taskId}/increase-required-workers`, { // Replace with your endpoint
          method: 'PUT',
        });

        setSubmissions(submissions.filter(submission => submission._id !== submissionId));
        alert('Submission rejected');
      } else {
        alert('Error rejecting submission');
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Buyer Dashboard</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Total Task Count: {totalTaskCount}</h3>
        <p className="text-gray-600">Total Pending Tasks: {pendingTaskCount}</p>
        <p className="text-gray-600">Total Payment Paid: ${totalPayment}</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Task to Review</h3>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">Worker Name</th>
            <th className="px-4 py-2 text-left border-b">Task Title</th>
            <th className="px-4 py-2 text-left border-b">Payable Amount</th>
            <th className="px-4 py-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{submission.worker_name}</td>
              <td className="px-4 py-2 border-b">{submission.task_title}</td>
              <td className="px-4 py-2 border-b">${submission.payable_amount}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleApprove(submission._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(submission._id, submission.task_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuyerHome;
