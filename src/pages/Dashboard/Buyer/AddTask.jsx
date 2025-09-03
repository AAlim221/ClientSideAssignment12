// src/pages/Dashboard/Buyer/AddTask.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

export default function AddTask() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [requiredWorkers, setRequiredWorkers] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [completionDate, setCompletionDate] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState('');
  const [taskImageUrl, setTaskImageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [buyerCoins, setBuyerCoins] = useState(100); // Example value, replace with actual buyer's coins
  const navigate = useNavigate(); // useNavigate for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPayableAmount = requiredWorkers * payableAmount;

    // Check if the buyer has enough coins
    if (totalPayableAmount > buyerCoins) {
      setStatusMessage('Not available Coin. Please purchase coins.');
      alert('Not available Coin. Please purchase coins.');
      // Navigate to the Purchase Coin page
      navigate('/purchase-coin');
      return;
    }

    // Task data to save
    const newTask = {
      task_title: taskTitle,
      task_detail: taskDetail,
      required_workers: requiredWorkers,
      payable_amount: payableAmount,
      completion_date: completionDate,
      submission_info: submissionInfo,
      task_image_url: taskImageUrl,
    };

    // Save the task into the database
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        // Reduce the buyer's coins
        setBuyerCoins(buyerCoins - totalPayableAmount);
        setStatusMessage('Task added successfully!');
        alert('Task added successfully!');
      } else {
        setStatusMessage('Error adding task');
        alert('Error adding task');
      }
    } catch (error) {
      setStatusMessage('Error adding task');
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Add New Task</h2>

      {statusMessage && <p className="text-red-600">{statusMessage}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="taskTitle" className="block text-gray-700">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="taskDetail" className="block text-gray-700">Task Detail</label>
          <textarea
            id="taskDetail"
            value={taskDetail}
            onChange={(e) => setTaskDetail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="requiredWorkers" className="block text-gray-700">Required Workers</label>
          <input
            type="number"
            id="requiredWorkers"
            value={requiredWorkers}
            onChange={(e) => setRequiredWorkers(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="payableAmount" className="block text-gray-700">Payable Amount (per worker)</label>
          <input
            type="number"
            id="payableAmount"
            value={payableAmount}
            onChange={(e) => setPayableAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="completionDate" className="block text-gray-700">Completion Date</label>
          <input
            type="date"
            id="completionDate"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="submissionInfo" className="block text-gray-700">Submission Info</label>
          <textarea
            id="submissionInfo"
            value={submissionInfo}
            onChange={(e) => setSubmissionInfo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="taskImageUrl" className="block text-gray-700">Task Image URL</label>
          <input
            type="url"
            id="taskImageUrl"
            value={taskImageUrl}
            onChange={(e) => setTaskImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
