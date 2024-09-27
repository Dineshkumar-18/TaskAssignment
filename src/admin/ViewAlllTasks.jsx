import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed
import axios from '../axiosConfig';

const ViewAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://localhost:7274/api/Tasks', {
          withCredentials: true, // Ensure credentials are sent if needed
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>All Tasks</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* New column */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.taskId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/${task.userId}/edit/${task.taskId}`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                </td> {/* Edit link */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllTasks;
