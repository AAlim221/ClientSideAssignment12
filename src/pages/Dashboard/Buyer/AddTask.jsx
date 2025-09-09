import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth'; // Custom hook for Firebase auth
import AxiosSecure from '../../../hooks/axiosSecure';

const AddTask = () => {
  const { user, loading } = useAuth(); // Using the custom hook for authentication
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [requiredWorkers, setRequiredWorkers] = useState('');
  const [payableAmount, setPayableAmount] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState('');
  const [taskImageUrl, setTaskImageUrl] = useState('');
  const [buyerName, setBuyerName] = useState(''); // New state for Buyer Name
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to login page if the user is not logged in
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null; // Prevent rendering the form if the user is not logged in
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to numbers and validate
    const workers = Number(requiredWorkers);
    const amount = Number(payableAmount);

    if (workers <= 0 || amount <= 0) {
      setError('Please enter valid positive values for workers and payable amount.');
      return;
    }

    const totalCost = workers * amount;

    // Check if user has enough coins
    if (user.coins < totalCost) {
      alert("Not enough coins. Please purchase coins.");
      navigate('/purchase-coin');
      return;
    }

    const taskData = {
      taskTitle,
      taskDetail,
      requiredWorkers: workers,
      payableAmount: amount,
      completionDate,
      submissionInfo,
      taskImageUrl,
      userId: user.uid,  // Ensure user.uid is passed correctly
      buyerName, // Include buyerName in task data
    };

    console.log("Task data being sent:", taskData);

    try {
      // Step 1: Create task
      const taskResponse = await AxiosSecure.post('/api/tasks', taskData);

      if (taskResponse.status === 200) {
        // Step 2: Deduct coins (no role check anymore)
        const coinResponse = await AxiosSecure.patch('/api/users/deduct-coins', {
          userId: user.uid,  // Use user.uid here
          totalCost,
        });

        if (coinResponse.status === 200) {
          alert('Task created and coins deducted successfully!');
          navigate('/dashboard');
        } else {
          setError('Failed to deduct coins. Please try again.');
        }
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting task:', err.response ? err.response.data : err);
      setError(`An error occurred while creating the task. Server message: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-blue-300 font-semibold text-center mb-6">Add New Task</h2>

      {/* Error Display */}
      {error && <div className="bg-red-200 p-2 rounded mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Task Detail Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Detail</label>
          <textarea
            value={taskDetail}
            onChange={(e) => setTaskDetail(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          ></textarea>
        </div>

        {/* Buyer Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Required Workers Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Required Workers</label>
          <input
            type="number"
            value={requiredWorkers}
            onChange={(e) => setRequiredWorkers(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Payable Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payable Amount per Worker</label>
          <input
            type="number"
            value={payableAmount}
            onChange={(e) => setPayableAmount(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Completion Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Completion Date</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Submission Info Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Submission Info</label>
          <input
            type="text"
            value={submissionInfo}
            onChange={(e) => setSubmissionInfo(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Task Image URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Image URL</label>
          <input
            type="url"
            value={taskImageUrl}
            onChange={(e) => setTaskImageUrl(e.target.value)}
            required
            className="w-full mt-2 p-3 border border-gray-300 rounded-md text-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 mt-4 text-white font-semibold rounded-md transition-colors ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
