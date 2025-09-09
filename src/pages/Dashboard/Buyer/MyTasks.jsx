import React, { useEffect, useState } from 'react';
import AxiosSecure from '../../../hooks/axiosSecure'; // Ensure Axios instance is set up

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await AxiosSecure.get('/api/admin/tasks');
        setTasks(response.data.tasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task update
  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await AxiosSecure.patch(`/api/tasks/${updatedTask._id}`, updatedTask);
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setModalOpen(false);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Handle task delete
  const handleDeleteTask = async (taskId) => {
    try {
      await AxiosSecure.delete(`/api/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="text-center text-gray-500">Loading tasks...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center p-4 text-black">No tasks available</div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-200 relative">
              {/* Buttons in the top-right corner */}
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => { setTaskToUpdate(task); setModalOpen(true); }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>

              {/* Task Image */}
              {task.taskImageUrl && (
                <div className="mb-4">
                  <img src={task.taskImageUrl} alt={task.taskTitle} className="w-full h-48 object-cover rounded-md" />
                </div>
              )}

              {/* Task Title and Details */}
             <div className="text-black max-w-full">
  <h3 className="text-xl font-semibold break-words">
taskTitle:
    {task.taskTitle}</h3>
  <p className="text-gray-600 break-words">
taskDetail:{task.taskDetail}</p>
  <p className="text-gray-500 mt-2 break-words">submissionInfo:{task.submissionInfo}</p>
</div>


              {/* Task Details */}
              <div className="mt-4 text-black">
                <div>
                  <span className="text-sm text-gray-500">Required Workers: </span>
                  <span className="font-semibold">{task.requiredWorkers}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payable Amount: </span>
                  <span className="font-semibold">${task.payableAmount}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Completion Date: </span>
                  <span className="font-semibold">{task.completionDate}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Updating Task */}
      {isModalOpen && taskToUpdate && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 animate__animated animate__fadeIn animate__faster">
            <h2 className="text-xl font-bold mb-4 text-black">Update Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Task Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.taskTitle}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, taskTitle: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Task Detail</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.taskDetail}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, taskDetail: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Submission Info</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.submissionInfo}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, submissionInfo: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Required Workers</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.requiredWorkers}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, requiredWorkers: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payable Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.payableAmount}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, payableAmount: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Completion Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={taskToUpdate.completionDate}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, completionDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleUpdateTask(taskToUpdate)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200"
              >
                Update
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementPage;
