// MainContent components
import React, { useState } from 'react';
import '../App.css';
import userProfile from '../assets/images/tiger.jpg'
import { Bell, ChevronDown, Eye, Languages, Plus, Search, Store } from 'lucide-react';
import Contents from './Contents';

function MainContent({isSidebarCollapsed, data}) {
  // initialize dark mode state
  const [isDark, setDarkMode] = useState(false);

  // dark mode toggle
  const handleDarkMode = () => {
    setDarkMode(!isDark);
  };

  return (
    <section className='bg-gray-50/80 md:px-1 w-full'>
        <div className='bg-white rounded-md px-1 py-2 block md:flex justify-between gap-10 max-md:space-y-5 items-center'>
          
          {/* form control for the different user search */}
          <div className='ml-2'>
            <form action="" className='relative'>
              <input type="search" name="search" id="search" placeholder='Search property, location or more' 
               className={`font-Custom font-medium text-sm text-gray-600/80 px-10 md:px-9 lg:px-16 py-3 rounded-lg  
               w-full lg:w-[22rem]  h-10 ${isSidebarCollapsed ? 'md:w-[20rem] ' : 'md:w-[15rem] lg:w-[22rem]'} outline-blue-400 bg-white shadow-sm border relative`}/>
              <button type="submit" className='absolute top-3 md:left-2 left-2 lg:left-4'>
                <Search size={20} className='text-gray-800/50'/>
              </button>
            </form>
          </div>
            <div className="flex flex-nowrap justify-between items-center px-1 gap-2 lg:gap-4">
              {/* left hand user information */}
              {/* <div className='flex justify-between md:justify-center gap-2'>
                <button  className='bg-white max-lg:hidden lg:block flex px-2 lg:px-1 shadow gap-3 py-2 max-w-[8rem] rounded-md'>
                  <Eye size={20} className='text-blue-500'/>
                  <p className='font-Custom font-bold text-sm text-gray-600'>4 <span className='text-xs text-gray-900/60 font-semibold'>views</span></p>
                  <div className='flex bg-blue-600 rounded-full size-5 ml-2'>
                    <Plus size={20} className='text-white'/>
                  </div>
                </button>
                
              </div> */}
              
              <div className='pt-2 flex md:gap-6 gap-8 px-3 items-center'>
                {/* notification button */}
                <button className='relative'>
                  <Bell size={23} className='text-gray-600'/>
                  {/* this line of code depends if there are any notification */}
                  <div className='bg-red-500 rounded-full size-4 absolute -top-1.5 left-2 font-Custom font-normal text-xs text-white transition-colors'>2</div>
                </button>
                {/* store button */}
                <button className='relative'>
                  <Store size={23} className='text-gray-600'/>
                  {/* this line of code depends if there are any properties the user has viewed 
                  and stored in the store so as to come and review anytime */}
                  <div className='bg-red-500 rounded-full size-4 absolute -top-1.5 left-2 font-Custom font-normal text-xs text-white transition-colors'>2</div>
                </button>
                <div className='flex gap-2 shrink-0 max-md:hidden items-center justify-center'>
                    {/* user profile image or avatar */}
                    <div className='relative shrink-0'>
                      <img src={userProfile} alt="" srcset="" className='size-8 rounded-full'/>
                      {/* green light for if user is active */}
                      <div className='bg-green-400 rounded-full size-2 absolute top-6 left-6 transition-colors'></div>
                    </div>
                    {/* user name gotten after login */}
                    {/* change contents based on the selected link */}
                    <p className='font-bold font-Custom text-sm text-gray-600'>
                      Hamed Safari
                    </p>
                </div>
              </div>
            </div>
        </div>
        {/* section for the different links */}
        <div className='bg-white rounded-md py-3 lg:mt-1 px-2 h-auto'>
            <Contents data={data}/>
        </div>
    </section>
  )
}

export default MainContent;
