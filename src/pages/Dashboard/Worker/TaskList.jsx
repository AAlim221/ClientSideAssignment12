// src/pages/Dashboard/Worker/TaskList.jsx
import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        
        // Check if the response is OK (status 200)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        // Check if the content type is JSON
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response, but got HTML');
        }

        // Parse the JSON response
        const data = await response.json();
        setTasks(data); // Store the tasks
      } catch (err) {
        setError('Error loading tasks: ' + err.message);
      }
    };

    fetchTasks();
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Available Tasks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-gray-800">{task.task_title}</h3>
            <p className="text-gray-600">Buyer: {task.buyer_name}</p>
            <p className="text-gray-600">Completion Date: {new Date(task.completion_date).toLocaleDateString()}</p>
            <p className="text-gray-600">Payable Amount: ${task.payable_amount}</p>
            <p className="text-gray-600">Required Workers: {task.required_workers}</p>
            <Link to={`/dashboard/task-details/${task._id}`} className="mt-4 inline-block text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
