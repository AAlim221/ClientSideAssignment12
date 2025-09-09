import React, { useEffect, useState } from 'react';
import axiosSecure from '../../../hooks/axiosSecure'; // Assuming axiosSecure is already set up

export default function AdminManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosSecure.get('/api/admin/tasks');
        console.log('Fetched Tasks:', response); // Log the entire response
        if (response.status === 200) {
          setTasks(response.data.tasks); // Assuming tasks are under the 'tasks' key in the response
        } else {
          console.error('Unexpected response status:', response.status);
          setStatusMessage('Error fetching tasks. Please try again.');
        }
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
      const response = await axiosSecure.post('/api/admin/remove-task', { taskId });
      if (response.status === 200) {
        setStatusMessage('Task removed successfully');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center p-4">No tasks available</div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="relative bg-white rounded-lg shadow-md p-6">
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  onClick={() => handleRemoveTask(task._id)}
                >
                  Delete
                </button>
                <h3 className="text-xl font-semibold text-gray-800">TaskTiitle:{task.taskTitle}</h3>
                <p className="text-gray-600 mt-2">Taskdetails:{task.taskDetail}</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Completion Date: {task.completionDate}</p>
                  <p>Required Workers: {task.requiredWorkers}</p>
                  <p>Payable Amount: ${task.payableAmount}</p>
                  <p>Submission Info: {task.submissionInfo}</p>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <img src={task.taskImageUrl} alt={task.taskTitle} className="w-16 h-16 object-cover mt-4" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
