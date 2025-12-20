// Admin Sidebar Component
// Renders a collapsible sidebar with main menu items and a special Settings sub-menu.
// The Settings menu expands to show sub-items directly without category grouping.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.svg';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building,
  FileText,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronLast,
  ChevronFirst,
  Menu,
  X
} from 'lucide-react';
import Eventbus from '@/lib/utils/Eventbus';
import { useAuth } from '@/lib/auth-context';

// Main menu items for the sidebar navigation
const menuItems = [
  { id: 1, name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 2, name: 'Clients', icon: Users, path: '/dashboard/clients' },
  { id: 3, name: 'Caretakers', icon: UserCheck, path: '/dashboard/caretakers' },
  { id: 4, name: 'House Agents', icon: Building, path: '/dashboard/house-agents' },
  { id: 5, name: 'Properties', icon: Building, path: '/dashboard/properties' },
  { id: 6, name: 'Blogs', icon: FileText, path: '/dashboard/blogs' },
  { id: 7, name: 'Notification', icon: Bell, path: '/dashboard/notification' },
  { id: 8, name: 'Members', icon: User, path: '/dashboard/members' },
  { id: 9, name: 'Setting', icon: Settings, path: '/dashboard/settings' }, // This item has sub-menu items
  { id: 10, name: 'Logout', icon: LogOut, cb: new Eventbus()  },
];


function Sidebar({ isCollapsed, setIsCollapsed }) {
  // State for mobile menu overlay
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const item10 = menuItems.find(i=>i.id==10);
  item10.cb.subscribe('action', signOut.bind(this))

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-white shadow p-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-8" />
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="p-2"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`bg-white min-h-screen p-4 shadow-lg w-64 transition-all duration-300 fixed top-0 left-0 z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <button
          className="md:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <div className="flex items-center justify-between gap-2 mx-auto mb-8">
          <img src={logo} alt="Logo" className={`h-10 w-[120px] mr-2 ${isCollapsed ? 'hidden' : 'block'}`} />
          <button
            type="button"
            className="hidden md:block rounded hover:bg-gray-200 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronLast size={20} className="text-gray-600 ml-3" />
            ) : (
              <ChevronFirst size={20} className="text-gray-600 mr-2" />
            )}
          </button>
        </div>
        <nav className="mt-8">
          <ul className={`mx-auto ${isCollapsed ? 'space-y-6' : 'space-y-5'}`}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path || ''}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
                  onClick={() => {setIsMobileMenuOpen(false); item.cb?.dispatch('action')}}
                >
                  <item.icon size={20} className="mr-3 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;