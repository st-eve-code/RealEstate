import React, { useState } from 'react';
import Logo from '../assets/logo.svg';
import {
   Building,
   LayoutDashboard,
   Menu, 
   ChevronDown,
   ChevronFirst,
  ChevronLast,
  Bell,
  LogOut,
  HistoryIcon,
  Coins,
  UserCircle,
  } from 'lucide-react';

function Sidebar() {
  const [open, setOpen] = useState(true);
  // dashboard different menus
  const Menu = [
    {
      icon: LayoutDashboard,
      name: 'Dashboard',
      Link_path: '/dashboard'
    },
    {
      icon: Building,
      name: 'Properties',
      Link_path: '/dashboard/properties'
    },
    {
      icon: UserCircle,
      name: 'Profile',
      Link_path: '/dashboard/profile'
    },
    {
      icon: HistoryIcon,
      name: 'Transactions',
      Link_path: '/dashboard/transactions'
    },
    {
      icon: Bell,
      name: 'Notifications',
      Link_path: '/dashboard/notification'
    },
    {
      icon: Coins,
      name: 'Subscription plans',
      Link_path: '/dashboard/subscription-plan'
    },
  ]
  return (
    <>
      {/* Hamburger for small screens */}
      <div className="md:hidden p-4">
        <button onClick={() => setOpen(!open)}>
          <Menu size={24} className='text-black'/>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 w-64 p-6 shadow-md md:block ${
          open ? 'block' : 'hidden'
        } fixed md:relative h-full z-20`}
      >
        <img src={Logo} alt="logo" className="h-9 lg:h-9 w-auto cursor-pointer"/>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="text-gray-700 dark:text-white hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/settings" className="text-gray-700 dark:text-white hover:text-blue-600">
            Settings
          </Link>
          <Link to="/logout" className="text-gray-700 dark:text-red-400 hover:text-red-500">
            Logout
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
