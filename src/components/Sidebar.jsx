import React, { useState } from 'react';
import {
  Building,
  UserCircle,
  History,
  Bell,
  Coins,
  PieChart,
  Menu,
  ChevronFirst,
  X,
  ChevronLast,
  Store,
  LogOut,
  HelpCircle,
  Settings
} from 'lucide-react';

// Mock logo - replace with your actual import
import logo from '../assets/logo.svg';
// Mock Logout component for demo
function Logout({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="font-bold text-xl text-gray-800 mb-4 text-center">Logout Confirmation</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Are you sure you want to logout from your account?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ isCollapsed, onToggle, onSelect }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const handleLogoutConfirm = () => {
    // Clear authentication tokens/session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Close modal
    setShowLogoutModal(false);
    
    // Navigate to login (you'll need to use your navigate function here)
    console.log('Navigating to login...');
    // navigate('/login');
  };

  // Handle selected option
  const HandleSelection = (option) => {
    onSelect(option);
    setOpen(false); // Close mobile menu after selection
  };

  const handleLogoClick = () => {
    console.log('Navigate to home');
    // navigate('/');
  };

  // Toggle sidebar collapse for desktop
  const handleToggle = () => {
    onToggle();
  };

  // Dashboard menu options
  const MenuOptions = [
    {
      menu_icon: PieChart,
      name: 'Dashboard',
      content: 'dashboard'
    },
    {
      menu_icon: Building,
      name: 'Properties',
      content: 'properties'
    },
    {
      menu_icon: UserCircle,
      name: 'Profile',
      content: 'profile'
    },
    {
      menu_icon: History,
      name: 'Transactions',
      content: 'transaction'
    },
    {
      menu_icon: Store,
      name: 'Store',
      content: 'store'
    },
    {
      menu_icon: Bell,
      name: 'Notifications',
      content: 'notification'
    },
    {
      menu_icon: Coins,
      name: 'Subscription Plans',
      content: 'subscription'
    }
  ];

  // Bottom menu options
  const BottomMenuOptions = [
    {
      menu_icon: Settings,
      name: 'Settings',
      content: 'setting'
    },
    {
      menu_icon: HelpCircle,
      name: 'Help',
      content: 'help'
    }
  ];

  // Shared button classes
  const getButtonClasses = () => {
    return `w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 group ${
      isCollapsed ? 'md:justify-center' : 'justify-start'
    }`;
  };

  const getIconClasses = () => {
    return 'text-gray-600 group-hover:text-blue-600 transition-colors flex-shrink-0';
  };

  const getTextClasses = () => {
    return `font-semibold text-sm text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap ${
      isCollapsed ? 'md:hidden' : 'block'
    }`;
  };

  return (
    <>
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          isOpen ? 'fixed inset-0 z-40 w-full' : 'w-full md:sticky md:top-0 md:h-screen'
        }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
          {/* Logo */}
          <div
            className={`cursor-pointer transition-all duration-300 ${
              isCollapsed ? 'md:hidden' : 'md:block'
            } ${isOpen ? 'block' : 'block md:block'}`}>
            <img
              src={logo}
              alt="RentSpot Logo"
              className="h-10"
              onClick={handleLogoClick}
            />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!isOpen)}
            type="button"
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu">
            {isOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={handleToggle}
            type="button"
            className={`hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
            aria-label="Toggle sidebar">
            {isCollapsed ? (
              <ChevronLast size={20} className="text-gray-600" />
            ) : (
              <ChevronFirst size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Content - Always visible on desktop, toggleable on mobile */}
        <div
          className={`flex flex-col flex-1 overflow-y-auto ${
            isOpen ? 'flex' : 'hidden md:flex'
          }`}>
          
          {/* Main Menu */}
          <div className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {MenuOptions.map((menu, index) => {
                const Icon = menu.menu_icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => HandleSelection(menu.content)}
                    className={getButtonClasses()}>
                    <Icon size={22} className={getIconClasses()} />
                    <span className={getTextClasses()}>{menu.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="px-4">
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Bottom Menu */}
          <div className="px-3 py-4">
            <nav className="space-y-1">
              {BottomMenuOptions.map((menu, index) => {
                const Icon = menu.menu_icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => HandleSelection(menu.content)}
                    className={getButtonClasses()}>
                    <Icon size={22} className={getIconClasses()} />
                    <span className={getTextClasses()}>{menu.name}</span>
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(true);
                  setOpen(false); // Close mobile menu when opening modal
                }}
                className={`${getButtonClasses()} hover:bg-red-50`}>
                <LogOut size={22} className="text-red-500 group-hover:text-red-600 transition-colors flex-shrink-0" />
                <span className={`font-semibold text-sm text-red-600 group-hover:text-red-700 transition-colors whitespace-nowrap ${
                  isCollapsed ? 'md:hidden' : 'block'
                }`}>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Logout Modal - Rendered outside sidebar */}
      <Logout
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;