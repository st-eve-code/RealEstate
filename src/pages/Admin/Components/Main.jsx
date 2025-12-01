import { Bell, Search } from 'lucide-react';
import avatar from '../../../assets/images/tiger.jpg'
import React from 'react';

function Main() {
  return (
   <section className='bg-white w-full p-4 max-md:mt-16'>
    <nav className='font-Custom font-bold text-base text-gray-700 flex justify-between items-center max-md:flex-wrap max-md:gap-4'>
      <h1>Admin Dashboard</h1>
      <div className='flex justify-center items-center gap-3'>
        <div className='relative'>
          <Bell className='cursor-pointer' />
          <span className='absolute -top-1 right-2 left-3 inline-block w-2 h-2 bg-red-600 rounded-full'></span>
        </div>
        <div className='flex items-center relative'>
          {/* search field and user avatar */}
          <div className='flex items-center'>
             <input type="search" name="search" id="search" placeholder='Search user information...'  className="border pl-2 font-Poppins font-medium text-xs text-gray-700 md:px-8 lg:px-12 max-md:px-12 rounded-md py-2 outline-blue-400 w-full" />
             {/* search icon */}
             <Search className='absolute right-62 left-3 top-2 text-gray-400' size={20}/>
          </div>
          {/* search btn */}
          <button type='submit'  className='bg-blue-600 text-white font-Poppins font-medium text-xs px-4 py-2 rounded-md ml-2 '>Search</button>
          {/* user avatar */}
          <img src={avatar} alt="User Avatar" className='w-8 h-8 rounded-full ml-4 max-md:hidden ' />
        </div>
      </div>
    </nav>

   </section>
  )
}

export default Main