import Sidebar from '../components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function DashBoard() {
  return (
    <div className='flex'>
        <Sidebar/>
        <div className='flex-1'>
            <Outlet></Outlet>
        </div>
      
    </div>
  )
}

export default DashBoard
 