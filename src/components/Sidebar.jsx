// Side bar component

import React, {useState} from 'react';
import {Building, UserCircle, History, Bell, Coins, PieChart, Menu, ChevronFirst, X, ChevronLast, Store , User, LogOut, Settings} from 'lucide-react';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function Sidebar({isCollapsed, onToggle, onSelect}) {
  // handle selected option
  const HandleSelection = (option) => {
    onSelect(option);
    onToggle(false);
  }

  // initialize navigation
  const navigate = useNavigate();

  // variable to control the menu
  const [isOpen, setOpen] = useState(false);

  // dashboard different menus
  const MenuOptions = [
    {
      menu_icon: PieChart,
      name: 'Dashboard',
      Link_path: '/dashboard',
      content: 'dashboard'
    },
    {
      menu_icon: Building,
      name: 'Properties',
      Link_path: '/dashboard/properties',
      content: 'properties'
    },
    {
      menu_icon: UserCircle,
      name: 'Profile',
      Link_path: '/dashboard/profile',
      content: 'profile'
    },
    {
      menu_icon: History,
      name: 'Transactions',
      Link_path: '/dashboard/transactions',
      content: 'transaction'

    },
    {
      menu_icon: Store,
      name: 'Store',
      Link_path: '/dashboard/store',
      content: 'store'
    },
    {
      menu_icon: Bell,
      name: 'Notifications',
      Link_path: '/dashboard/notification',
      content: 'notification'
    },
    {
      menu_icon: Coins,
      name: 'Subscription plans',
      Link_path: '/dashboard/subscription-plan',
      content: 'subscription'
    },
    
  ]

  return (
    <section className={`px-1 lg:px-3 pt-2 md:h-auto w-full md:border-r border-gray-300/80  transition-all duration-300 ease-in-out ${!isCollapsed ? 'md:w-52 lg:w-64': 'md:w-24'} ${!isOpen ? 'h-16 md:min-h-screen bg-white relative' : 'bg-white min-h-screen relative'}`}>
      <nav className='flex justify-between items-center w-full gap-10 py-2 px-2 md:px-2'>
        {/* Logo - Always visible on mobile, conditionally on desktop */}
        <div className={`w-32 h-18 cursor-pointer ${isCollapsed ? 'max-md:block md:hidden' : 'block'}`}>
          <img src={logo} alt="" onClick={()=> navigate('/')}/>
        </div>
        
        {/* Mobile menu toggle */}
        <button onClick={()=>setOpen(!isOpen)} type="button" className='md:hidden'>
          {isOpen ? <X size={20} className='text-gray-800'/> : <Menu size={20} className='text-gray-800' />}
        </button>
        
        {/* Desktop collapse toggle */}
        <button onClick={onToggle} type="button" className={`max-md:hidden bg-gray-50/30 shadow-sm rounded-md lg:p-2 border-none outline-none mx-auto`}>
          {isCollapsed ? <ChevronLast size={20} className='text-gray-600'/> : <ChevronFirst size={20} className='text-gray-600' />}
        </button>
      </nav>

      {/* this section of the code changes the state of the menu links, keeping the links visible only when the menu icon is clicked and vice-versa  */}

      <main className={`w-full h-auto md:px-1 px-3 py-2 mx-auto ${!isOpen ? 'hidden md:block h-auto relative' : 'block relative'}`}>
        <div className='mx-auto w-full pt-2'>
          {
            MenuOptions.map((menu, index) => { 
              const Icons = menu.menu_icon;
              return (
                <div key={index} className='mx-auto w-full'>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      // navigate(menu.Link_path);
                      HandleSelection(menu.content);
                    }}
                    className={`*:hover:text-blue-600 hover:animate-pulse duration-300 transition-all ease-in-out hover:bg-blue-400/10 hover:border-r-4 hover:border-blue-800/60 w-full ${isCollapsed ? 'md:p-5 p-2 flex items-center gap-4 h-16' : 'flex mx-auto items-center gap-4 p-2 h-16'}`}
                  >
                    <Icons size={22} className={`${isCollapsed ? 'md:mx-auto text-gray-500' : 'text-gray-500'}`}/>
                    <p className={`${isCollapsed ? 'md:hidden font-bold font-Custom text-md text-gray-700': 'font-bold font-Custom text-md text-gray-700'}`}>
                      {menu.name}
                    </p>
                  </button>
                </div>
              )
            })
          }
        </div>
        {/* section for other menus */}
      {/* change from this line and arrange the logic */}
      <div className={`mx-auto ${!isOpen ? 'hidden md:block mt-56 mx-auto bottom-0 relative h-auto w-full ' : 'block relative'}`}>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            // navigate(menu.Link_path);
            HandleSelection('settings');
          }}
          className={` *:hover:text-blue-600 hover:animate-pulse duration-300 transition-all ease-in-out hover:bg-blue-400/10 hover:border-r-4 hover:border-blue-800/60 w-full ${isCollapsed ? ' p-2 flex items-center gap-4 h-16 ' : 'flex items-center gap-4 p-2 h-16'}`}
        >
          <Settings size={22} className={`${isCollapsed ? 'md:mx-auto text-gray-500' : 'text-gray-500'}`}/>
          <p className={`${isCollapsed ? 'md:hidden font-bold font-Custom text-md text-gray-700': 'font-bold font-Custom text-md text-gray-700'}`}>
            Settings
          </p>
        </button>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            // navigate(menu.Link_path);
            HandleSelection('logout');
          }}
          className={`*:hover:text-blue-600 hover:animate-pulse duration-300 transition-all ease-in-out hover:bg-blue-400/10 hover:border-r-4 hover:border-blue-800/60 w-full ${isCollapsed ? 'p-2 flex items-center gap-4 h-16' : 'flex mx-auto items-center gap-4 p-2 h-16'}`}
        >
          <LogOut size={22} className={`${isCollapsed ? 'md:mx-auto text-gray-500' : 'text-red-500/70'}`}/>
          <p className={`${isCollapsed ? 'md:hidden font-bold font-Custom text-md text-gray-700': 'font-bold font-Custom text-md text-gray-700'}`}>
            Logout
          </p>
        </button>
      </div>
      </main>
      
      
    </section>
  )
}

export default Sidebar