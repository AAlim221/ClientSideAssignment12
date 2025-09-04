import React, { useState } from 'react';
import axiosSecure from '../../../hooks/axiosSecure'; // Import axiosSecure for secure API calls
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [requiredWorkers, setRequiredWorkers] = useState('');
  const [payableAmount, setPayableAmount] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState('');
  const [taskImageUrl, setTaskImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const navigate = useNavigate(); // To navigate after success

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    // Validation check
    if (!taskTitle || !taskDetail || !requiredWorkers || !payableAmount || !completionDate || !submissionInfo || !taskImageUrl) {
      setErrorMessage('All fields are required.');
      setIsLoading(false);
      return;
    }

    const taskData = {
      task_title: taskTitle,
      task_detail: taskDetail,
      required_workers: parseInt(requiredWorkers),
      payable_amount: parseFloat(payableAmount),
      completion_date: completionDate,
      submission_info: submissionInfo,
      task_image_url: taskImageUrl,
    };

    try {
      const token = localStorage.getItem('authToken'); // Get the JWT token

      // Sending the token in the Authorization header
      const response = await axiosSecure.post('/api/add-task', taskData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      if (response.data.message) {
        alert(response.data.message); // Show success message
        navigate('/dashboard'); // Navigate to the dashboard or task list
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error occurred while adding the task');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Task</h2>

      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Task Title */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter task title"
            />
          </div>

          {/* Task Detail */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Task Detail</label>
            <textarea
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Provide detailed task description"
              rows="4"
            />
          </div>

          {/* Required Workers */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Required Workers</label>
            <input
              type="number"
              value={requiredWorkers}
              onChange={(e) => setRequiredWorkers(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Number of workers required"
            />
          </div>

          {/* Payable Amount */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Payable Amount per Worker</label>
            <input
              type="number"
              value={payableAmount}
              onChange={(e) => setPayableAmount(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter amount payable to each worker"
            />
          </div>

          {/* Completion Date */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Completion Date</label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submission Info */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Submission Info</label>
            <input
              type="text"
              value={submissionInfo}
              onChange={(e) => setSubmissionInfo(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What should the worker submit (e.g., screenshot, proof)"
            />
          </div>

          {/* Task Image URL */}
          <div className="form-group">
            <label className="block text-gray-700 font-semibold">Task Image URL</label>
            <input
              type="text"
              value={taskImageUrl}
              onChange={(e) => setTaskImageUrl(e.target.value)}
              required
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="URL of the task image"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-1/2 py-3 bg-blue-600 text-white font-semibold rounded-md focus:outline-none hover:bg-blue-700"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? 'Submitting...' : 'Add Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
