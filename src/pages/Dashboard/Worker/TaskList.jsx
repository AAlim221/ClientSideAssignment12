import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import AxiosSecure from '../../../hooks/axiosSecure'; // Assuming you have AxiosSecure for API calls

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For storing error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch tasks data from the API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await AxiosSecure.get('/api/admin/tasks');
        console.log('Tasks fetched:', response.data.tasks); // Log the tasks data

        // Ensure that requiredWorkers is a valid number and filter tasks with available workers
        const filteredTasks = response.data.tasks.filter(
          task => Number(task.requiredWorkers) > 0
        );

        console.log('Filtered tasks:', filteredTasks); // Log the filtered tasks
        setTasks(filteredTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
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
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Show error message if data fetch failed
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{task.taskTitle}</h3>
              <p className="text-gray-600 mb-2"><strong>Buyer:</strong> {task.buyerName || 'N/A'}</p>
              <p className="text-gray-600 mb-2"><strong>Completion Date:</strong> {task.completionDate}</p>
              <p className="text-gray-600 mb-2"><strong>Payable Amount:</strong> ${task.payableAmount}</p>
              <p className="text-gray-600 mb-4"><strong>Required Workers:</strong> {task.requiredWorkers}</p>
              <button
                onClick={() => navigateToTaskDetails(task._id)} // On click, navigate to task details page
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
