import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../hooks/axiosSecure'; // Assuming axiosSecure is already set up

export default function AdminManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks on page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosSecure.get('/api/admin/tasks'); // Assuming the endpoint for fetching tasks is /api/admin/tasks
        setTasks(response.data); // Populate the tasks list
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setStatusMessage('Error fetching tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle removing a task
  const handleRemoveTask = async (taskId) => {
    try {
      const response = await axiosSecure.post('/api/admin/remove-task', { taskId }); // Assuming the endpoint for deleting a task is /api/admin/remove-task
      if (response.status === 200) {
        setStatusMessage('Task removed successfully');
        // Update tasks list to reflect the removal of the task
        setTasks(prevTasks => prevTasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error('Error removing task:', error);
      setStatusMessage('Error removing task. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Tasks</h2>

      {statusMessage && <p className="text-red-600">{statusMessage}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Task Title</th>
              <th className="border px-4 py-2">Task Description</th>
              <th className="border px-4 py-2">Completion Date</th>
              <th className="border px-4 py-2">Assigned Workers</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">No tasks available</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">{task.completionDate}</td>
                  <td className="border px-4 py-2">{task.assignedWorkers}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      onClick={() => handleRemoveTask(task._id)}
                    >
                      Delete Task
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
