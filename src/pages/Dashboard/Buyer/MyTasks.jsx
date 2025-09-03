// src/pages/Dashboard/Buyer/MyTasks.jsx
import React, { useState, useEffect } from 'react';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // For updating the task details
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [submissionDetails, setSubmissionDetails] = useState('');

  useEffect(() => {
    // Fetch tasks created by the user
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Fetch tasks from API
        const data = await response.json();
        setTasks(data.sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))); // Sort by completion date in descending order
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdate = async (taskId) => {
    // Update task in the database
    const updatedTask = {
      task_title: taskTitle,
      task_detail: taskDetail,
      submission_details: submissionDetails,
    };

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        alert('Task updated successfully');
        // Fetch the updated tasks after the update
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        );
        setTasks(updatedTasks);
        setSelectedTask(null); // Close the update form
      } else {
        alert('Error updating task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task');
    }
  };

  const handleDelete = async (taskId, requiredWorkers, payableAmount) => {
    // Delete the task and calculate refill amount
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const refillAmount = requiredWorkers * payableAmount;
        alert(`Task deleted successfully. Refill amount: $${refillAmount}`);

        // Increase the user's coin balance for uncompleted tasks (update this based on your logic)
        await fetch('/api/users/refill-coins', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refillAmount }),
        });

        setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the deleted task from the UI
      } else {
        alert('Error deleting task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Error deleting task');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">My Tasks</h2>
      {error && <p className="text-red-600">{error}</p>}

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">Task Title</th>
            <th className="px-4 py-2 text-left border-b">Task Detail</th>
            <th className="px-4 py-2 text-left border-b">Submission Details</th>
            <th className="px-4 py-2 text-left border-b">Required Workers</th>
            <th className="px-4 py-2 text-left border-b">Payable Amount</th>
            <th className="px-4 py-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{task.task_title}</td>
              <td className="px-4 py-2 border-b">{task.task_detail}</td>
              <td className="px-4 py-2 border-b">{task.submission_details}</td>
              <td className="px-4 py-2 border-b">{task.required_workers}</td>
              <td className="px-4 py-2 border-b">${task.payable_amount}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setTaskTitle(task.task_title);
                    setTaskDetail(task.task_detail);
                    setSubmissionDetails(task.submission_details);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(task._id, task.required_workers, task.payable_amount)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Task Form */}
      {selectedTask && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Task</h3>
          <div className="mb-4">
            <label htmlFor="taskTitle" className="block text-gray-700">Task Title</label>
            <input
              type="text"
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="taskDetail" className="block text-gray-700">Task Detail</label>
            <textarea
              id="taskDetail"
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="submissionDetails" className="block text-gray-700">Submission Details</label>
            <textarea
              id="submissionDetails"
              value={submissionDetails}
              onChange={(e) => setSubmissionDetails(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <button
            onClick={() => handleUpdate(selectedTask._id)}
            className="bg-green-600 text-white py-2 px-4 rounded-md"
          >
            Update Task
          </button>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
