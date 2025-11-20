import { Bell } from 'lucide-react'
import React from 'react'

function Main() {
  return (
   <section className='bg-white w-full p-4'>
    <nav className='font-Custom font-bold text-base text-gray-700'>
      <h1>Admin Dashboard</h1>
      <div>
        <div className='relative flex flex-col'>
          <button className='bg-white shadow-md rounded px-2 py-1.5'><Bell size={20} className='text-gray-600'/></button>
          <div className='right-0 left-0 top-2 inset-0 absolute text-white bg-red-500 rounded-full w-fit h-fit px-0.5 '>00</div>
        </div>
      </div>
    </nav>
   </section>
  )
}

export default Main