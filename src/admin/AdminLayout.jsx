import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const AdminLayout = () => {
  return (
    <div className='flex-col'>
       <NavBar/>
        <main className='p-8'>
            <Outlet/>
        </main>
    </div>
  )
}

export default AdminLayout
