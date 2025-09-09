import React, { useState, useEffect, useCallback } from 'react';
import AxiosSecure from '../../../hooks/axiosSecure'; // Axios instance

const BuyerHome = ({ userId }) => {
  const [dashboardData, setDashboardData] = useState({
    totalTaskCount: 0,
    pendingTaskCount: 0,
    totalPayment: 0,
  });
  const [tasksToReview, setTasksToReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null); // For modal

  // Memoized function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AxiosSecure.get(`/api/buyer-dashboard/${userId}`);
      console.log('Dashboard Data:', response.data); // Log response to verify data
      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Memoized function to fetch tasks to review
  const fetchTasksToReview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AxiosSecure.get(`/api/buyer-reviews/${userId}`);
      console.log('Tasks to Review:', response.data); // Log response to verify data
      setTasksToReview(response.data?.pendingSubmissions || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks to review:', error);
      setError('Failed to fetch tasks to review');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchDashboardData();
    fetchTasksToReview();
  }, [fetchDashboardData, fetchTasksToReview]);

  // Handle approve action
  const handleApprove = async (taskId, submissionId) => {
    if (window.confirm('Are you sure you want to approve this submission?')) {
      try {
        await AxiosSecure.patch(`/api/tasks/approve/${taskId}/${submissionId}`);
        fetchDashboardData();
        fetchTasksToReview();
      } catch (error) {
        console.error('Error approving submission:', error);
        setError('Failed to approve submission');
      }
    }
  };

  // Handle reject action
  const handleReject = async (taskId, submissionId) => {
    if (window.confirm('Are you sure you want to reject this submission?')) {
      try {
        await AxiosSecure.patch(`/api/tasks/reject/${taskId}/${submissionId}`);
        fetchDashboardData();
        fetchTasksToReview();
      } catch (error) {
        console.error('Error rejecting submission:', error);
        setError('Failed to reject submission');
      }
    }
  };

  // Handle modal view
  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission); // Show the selected submission in the modal
  };

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700">Dashboard</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Total Tasks</p>
                <p className="text-gray-900">{dashboardData.totalTaskCount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Pending Tasks</p>
                <p className="text-gray-900">{dashboardData.pendingTaskCount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Total Payment</p>
                <p className="text-gray-900">${dashboardData.totalPayment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tasks to Review Section */}
        <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">Tasks to Review</h3>
          {loading ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : tasksToReview.length === 0 ? (
            <p className="text-gray-500">No tasks to review</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left text-gray-600">Worker</th>
                  <th className="py-3 px-6 text-left text-gray-600">Task Title</th>
                  <th className="py-3 px-6 text-left text-gray-600">Payable Amount</th>
                  <th className="py-3 px-6 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasksToReview.map((task) =>
                  task.submissions && task.submissions.length > 0 ? (
                    task.submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="py-3 px-6">{submission.workerName}</td>
                        <td className="py-3 px-6">{task.taskTitle}</td>
                        <td className="py-3 px-6">${task.payableAmount}</td>
                        <td className="py-3 px-6 space-x-2">
                          <button
                            onClick={() => handleApprove(task._id, submission._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(task._id, submission._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleViewSubmission(submission)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            View Submission
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={task._id}>
                      <td colSpan="4" className="text-center py-3 px-6 text-gray-500">
                        No submissions found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Viewing Submission Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold">Submission Details</h3>
            <p className="mt-4"><strong>Worker Name:</strong> {selectedSubmission.workerName}</p>
            <p><strong>Task Title:</strong> {selectedSubmission.taskTitle}</p>
            <p><strong>Submission Info:</strong> {selectedSubmission.submissionInfo}</p>
            <p><strong>Payable Amount:</strong> ${selectedSubmission.payableAmount}</p>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
