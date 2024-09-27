import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const navigate = useNavigate();
  const userId = 1; 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://localhost:7274/api/Tasks/taskbyuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
          },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleFilterChange = async (event) => {
    const selectedPriority = event.target.value;
    setPriorityFilter(selectedPriority);

    try {
      const response = await axios.get(`https://localhost:7274/api/Tasks/filterbypriority/${userId}?priority=${selectedPriority}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Error filtering tasks');
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <div className="mb-4">
        <label htmlFor="priority" className="mr-2">Filter by Priority:</label>
        <select
          id="priority"
          value={priorityFilter}
          onChange={handleFilterChange}
          className="border-gray-300 rounded-md shadow-sm"
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="px-4 py-2">Task ID</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.taskId}>
                <td className="px-4 py-2 border-b">{task.taskId}</td>
                <td className="px-4 py-2 border-b">{task.title}</td>
                <td className="px-4 py-2 border-b">{task.description}</td>
                <td className="px-4 py-2 border-b">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{task.priority}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(task.taskId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center">No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
