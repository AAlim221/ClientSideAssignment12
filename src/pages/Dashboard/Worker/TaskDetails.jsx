import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function TaskDetails() {
  const { taskId } = useParams(); // Get taskId from the URL
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [error, setError] = useState(null);

  // Fetch task details based on the taskId
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Task not found');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        console.error('Error fetching task details:', err.message); // Logging the error
        setError('Failed to load task details');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Handle form submission
  const handleSubmission = async (e) => {
    e.preventDefault();

    if (!submissionDetails.trim()) {
      setSubmissionStatus('Submission details cannot be empty.');
      return;
    }

    const submissionData = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: 'worker@example.com', // Replace with actual worker email (from AuthContext)
      submission_details: submissionDetails,
      worker_name: 'Worker Name', // Replace with actual worker name (from AuthContext)
      buyer_name: task.buyer_name,
      buyer_email: task.buyer_email,
      current_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const response = await fetch('/api/submissions', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmissionStatus('Submission successful!');
        setSubmissionDetails('');
      } else {
        setSubmissionStatus('Failed to submit the task.');
      }
    } catch (err) {
      setSubmissionStatus('Error submitting the task.');
      console.error('Submission error:', err.message);
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!task) {
    return <div className="text-red-600">Task not available</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Task Details</h2>

      {/* Task Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{task.task_title}</h3>
        <p className="text-gray-600">Buyer: {task.buyer_name}</p>
        <p className="text-gray-600">Completion Date: {new Date(task.completion_date).toLocaleDateString()}</p>
        <p className="text-gray-600">Payable Amount: ${task.payable_amount}</p>
        <p className="text-gray-600">Required Workers: {task.required_workers}</p>
        <p className="text-gray-600 mt-4">Task Description: {task.task_detail}</p>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmission} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Your Work</h3>

        <div className="mb-4">
          <label htmlFor="submissionDetails" className="block text-gray-700">Submission Details:</label>
          <textarea
            id="submissionDetails"
            name="submissionDetails"
            value={submissionDetails}
            onChange={(e) => setSubmissionDetails(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Provide the details of your submission..."
            required
          />
        </div>

        {submissionStatus && (
          <div className="mb-4 text-red-600">{submissionStatus}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TaskDetails;
