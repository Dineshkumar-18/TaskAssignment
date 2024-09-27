
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const AddTask = () => {
  const { userid } = useParams();
  const [task, setTask] = useState({
    userId: userid,
    title: "",
    description: "",
    dueDate: "",
    priority: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setTask({
      ...task,
      [name]: type === 'date' ? value : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7274/api/Tasks", task,{
        withCredentials: true,
      });
      console.log(response.data);
      setError("");
      navigate("/admin/"); // Redirect to the task list or dashboard after successful addition
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-96 h-max p-3 bg-gray-400 rounded-lg flex flex-col gap-6'>
        <h1 className='text-2xl text-center font-bold'>Add Task</h1>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <div className='flex items-center gap-3'>
          <label htmlFor='title' className='text-xl font-semibold'>Title</label>
          <input type="text" name="title" id='title' onChange={handleChange} value={task.title} className='p-2 rounded-md w-full text-lg outline-none' placeholder='Title'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='description' className='text-xl font-semibold'>Description</label>
          <textarea name="description" id='description' onChange={handleChange} value={task.description} className='p-2 rounded-md w-full text-lg outline-none' placeholder='Description'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='dueDate' className='text-xl font-semibold'>Due Date</label>
          <input type="date" name="dueDate" id='dueDate' onChange={handleChange} value={task.dueDate} className='p-2 rounded-md w-full text-lg'/>
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='priority' className='text-xl font-semibold'>Priority</label>
          <select name="priority" id='priority' onChange={handleChange} value={task.priority} className='p-2 rounded-md w-full text-lg'>
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className='text-center'>
          <button type='submit' className='px-5 py-2 bg-green-600 rounded-md text-white'>Add Task</button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
