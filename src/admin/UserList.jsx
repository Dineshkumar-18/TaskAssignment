import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserList = () => {

 const navigate=useNavigate()
 const [users,setUsers]=useState([])
 const [error,setError]=useState("")

 useEffect(()=>
{
   const getAllUsers=async()=>
   {
    try{
       const response=await axios.get("https://localhost:7274/api/Tasks/getallusers",
        {
            withCredentials: true
        }
    )
    console.log(response.data)
    setUsers(response.data)
    }
    catch(error)
    {
      console.log(error.message)
      setError(error.message)
    }
   }
   getAllUsers()
},[])

  return (
    <div>
      <h1 className='text-xl font-semibold'>User List</h1>
      <div className="container mx-auto">
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-gray-300 md:border-none block md:table-row">
            <th className="bg-gray-600 text-white p-2 md:table-cell">User ID</th>
            <th className="bg-gray-600 text-white p-2 md:table-cell">Name</th>
            <th className="bg-gray-600 text-white p-2 md:table-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {users.map((user) => (
            <tr
              key={user.userId}
              className="border border-gray-300 md:border-none block md:table-row text-center"
            >
              <td className="p-2 md:table-cell">{user.userId}</td>
              <td className="p-2 md:table-cell">{user.name}</td>
              <td className="p-2 md:table-cell">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1"
                  onClick={() => navigate(`/admin/${user.userId}/add-task`)}
                >
                  Add Task
                </button>
                {/* <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mx-1"
                  onClick={() => navigate(`/admin/${user.userId}/edit/{taskid}`)}
                >
                  Edit Task
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default UserList
