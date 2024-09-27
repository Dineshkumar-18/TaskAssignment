import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const priorityMap = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const reversePriorityMap = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

const EditTask = () => {
  const { userid, taskid } = useParams(); // Extract userid and taskid from params
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        // Fetch task details using both userid and taskid
        const response = await axios.get(`https://localhost:7274/api/Tasks/${taskid}`, {
          withCredentials: true, // Ensure credentials are sent if needed
        });
        // Map the numeric priority to its string equivalent
        const formattedDate = new Date(response.data.dueDate).toISOString().split('T')[0];

        setTask({
          ...response.data,
          priority: reversePriorityMap[response.data.priority] || '',
          dueDate:formattedDate
        });
      } catch (error) {
        console.log(error);
        setError('Error fetching task details');
      }
    };
    fetchTask();
  }, [taskid]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert priority from string to numeric value before sending it
    const taskToSend = {
      ...task,
      priority: priorityMap[task.priority] || 1, // Default to 1 if priority is not found
    };
    try {
      // Update the task using the API
      await axios.put(`https://localhost:7274/api/Tasks/${taskid}`, taskToSend, {
        withCredentials: true, // Ensure credentials are sent if needed
      });
      setError("");
      navigate(`/admin/`); // Navigate to the view tasks page after update
    } catch (error) {
      console.error(error);
      setError('Error updating task');
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-96 h-max p-3 bg-gray-400 rounded-lg flex flex-col gap-6'>
        <h1 className='text-2xl text-center font-bold'>Edit Task</h1>
        <div className='flex items-center gap-3'>
          <label htmlFor='title' className='text-xl font-semibold'>Title</label>
          <input type="text" name="title" id='title' onChange={handleChange} value={task.title} className='p-2 rounded-md w-full text-lg outline-none' placeholder='Title'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='description' className='text-xl font-semibold'>Description</label>
          <input type="text" name="description" id='description' onChange={handleChange} value={task.description} className='p-2 rounded-md w-full text-lg outline-none' placeholder='Description'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='dueDate' className='text-xl font-semibold'>Due Date</label>
          <input type="date" name="dueDate" id='dueDate' onChange={handleChange} value={task.dueDate} className='p-2 rounded-md w-full text-lg'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='priority' className='text-xl font-semibold'>Priority</label>
          <select name="priority" id="priority" onChange={handleChange} value={task.priority} className='p-2 rounded-md w-full text-lg'>
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className='text-center'>
          <button type='submit' className='px-5 py-2 bg-green-600 rounded-md text-white'>Save</button>
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
      </form>
    </div>
  );
};

export default EditTask;
