import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='bg-blue-300 '>
        <ul className='flex gap-6 justify-center text-xl p-3 font-semibold'>
            <li><Link to="">Home</Link></li>
            <li><Link to="/admin/user-list">User List</Link></li>
            <li><Link to="/admin/:userid/add-task">Add Task</Link></li>
            <li><Link to="/admin/:userid/edit/:taskid">Edit Task</Link></li>
        </ul>
    </nav>
  )
}

export default NavBar
