// MainContent components
import React, { useState } from 'react';
import '../App.css';
import userProfile from '../assets/images/tiger.jpg'
import { Bell, ChevronDown, Eye, Heart, Languages, Plus, Search, Sun, Store, Moon } from 'lucide-react';

function MainContent({isSidebarCollapsed, children}) {
  // initialize dark mode state
  const [isDark, setDarkMode] = useState(false);

  // dark mode toggle
  const handleDarkMode = () => {
    setDarkMode(!isDark);
  };

  return (
    <section className='bg-gray-100/20 md:px-1 w-full min-h-screen'>
        <div className='bg-white rounded-md px-1 py-2 block md:flex justify-between gap-10 max-md:space-y-5 items-center'>
          
          {/* form control for the different user search */}
          <div className='max-md:mx-auto px-2'>
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
                {/* settings */}
                <button onClick={handleDarkMode} className='relative max-md:hidden'>
                  {isDark ? <Sun size={23} className='text-gray-600'/> : <Moon size={23} className='text-gray-600'/>}
                </button>
                
                {/* notification button */}
                <button className='relative max-md:hidden'>
                  <Bell size={23} className='text-gray-600'/>
                  {/* this line of code depends if there are any notification */}
                  <div className='bg-red-500 rounded-full size-4 absolute -top-1.5 left-2 font-Custom font-normal text-xs text-white transition-colors'>2</div>
                </button>
                {/* store button */}
                <button className='relative max-md:hidden'>
                  <Store size={23} className='text-gray-600'/>
                  {/* this line of code depends if there are any properties the user has viewed 
                  and stored in the store so as to come and review anytime */}
                  <div className='bg-red-500 rounded-full size-4 absolute -top-1.5 left-2 font-Custom font-normal text-xs text-white transition-colors'>2</div>
                </button>
                <div className='flex gap-2 shrink-0 items-center max-md:hidden justify-center'>
                    {/* user profile image or avatar */}
                    <div className='relative shrink-0'>
                      <img src={userProfile} alt="" srcset="" className='md:size-8 size-7 rounded-full'/>
                      {/* green light for if user is active */}
                      <div className='bg-green-400 border-2 border-white rounded-full size-2.5 absolute top-5 md:top-6 left-5 transition-colors'></div>
                    </div>
                    {/* user name gotten after login */}
                    {/* change contents based on the selected link */}
                    
                </div>
                
              </div>
            </div>
        </div>
        {/* section for the different links */}
        <div className='bg-white rounded-md py-2 pb-10 lg:mt-1 px-2  h-auto'>
            {children}
        </div>
    </section>
  )
}

export default MainContent;
