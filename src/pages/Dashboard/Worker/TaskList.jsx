import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch tasks data from the API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true before fetching data
      const response = await fetch('/api/tasks'); // Replace with your real API endpoint
      const data = await response.json();
      setTasks(data.filter(task => task.required_workers > 0)); // Only show tasks where required_workers > 0
      setLoading(false); // Set loading to false after fetching data
    };

    fetchTasks();
  }, []);

  const navigateToTaskDetails = (taskId) => {
    // Use navigate to go to the task details route
    navigate(`/task-details/${taskId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Available Tasks</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tasks.map((task, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{task.task_title}</h3>
              <p className="text-gray-600 mb-2"><strong>Buyer:</strong> {task.buyer_name}</p>
              <p className="text-gray-600 mb-2"><strong>Completion Date:</strong> {task.completion_date}</p>
              <p className="text-gray-600 mb-2"><strong>Payable Amount:</strong> ${task.payable_amount}</p>
              <p className="text-gray-600 mb-4"><strong>Required Workers:</strong> {task.required_workers}</p>
              <button
                onClick={() => navigateToTaskDetails(task.id)} // On click, navigate to task details page
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
