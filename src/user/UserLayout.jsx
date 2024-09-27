import React from 'react'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div className='flex-col'>
        <main className='p-8'>
            <Outlet/>
        </main>
    </div>
  )
}

export default UserLayout
