// Side bar component

import React, {useState} from 'react';
import {Building, UserCircle, History, Bell, Coins, PieChart, Menu, ChevronFirst, X, ChevronLast, Store , User, LogOut} from 'lucide-react';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function Sidebar({isCollapsed, onToggle,onSelect}) {
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
    <section className={`px-1 lg:px-3 pt-2 md:h-auto w-full md:border-r-2 border-gray-100/30  transition-all duration-300 ease-in-out ${!isCollapsed ? 'md:w-52 lg:w-64 ': 'md:w-24 '} ${!isOpen ? 'h-16 md:min-h-screen bg-white' : 'bg-white min-h-screen'}`}>
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

      <main className={`w-full md:px-1 px-3 mx-auto ${!isOpen ? 'hidden md:block h-10' : 'block'}`}>
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
      </main>
      {/* User Profile Section */}
        <div className={`border-t md:mt-[36rem] lg:mt-[36rem] mt-5 mb-3 border-gray-200 p-4 ${!isOpen ? 'max-md:hidden' : 'block'}`}>
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@example.com</p>
              </div>
              <div className="flex flex-col space-y-1">
                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <User size={14} className="text-gray-500" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <LogOut size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-semibold text-sm">JD</span>
              </button>
              <div className="flex justify-center space-x-1">
                <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                  <User size={16} className="text-gray-500" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                  <LogOut size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
    </section>
  )
}

export default Sidebar