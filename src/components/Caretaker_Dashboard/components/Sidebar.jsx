'use client'

import React from 'react'
import { 
  Menu, 
  X, 
  MessageSquare, 
  Home,
  Building,
  Plus,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context';

const NavItem = ({children, icon: Icon, active, onClick, badge} = {}) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 group relative overflow-hidden ${
      active 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-white hover:shadow-md'
    }`}
  >
    {/* Active indicator */}
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
    )}
    
    {/* Icon */}
    {Icon && (
      <Icon 
        size={20} 
        className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`}
      />
    )}
    
    {/* Label */}
    <span className={`font-medium flex-1 ${active ? 'text-white' : ''}`}>
      {children}
    </span>
    
    {/* Badge */}
    {badge && (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
    
    {/* Chevron for active */}
    {active && (
      <ChevronRight size={16} className="text-white" />
    )}
  </button>
)

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }){
  const pathname = usePathname();
  const {signOut} = useAuth();

  // Determine active route
  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(path);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed at top */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          w-72 p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen border-r border-gray-200 shadow-xl
          fixed md:sticky top-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                R
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">RentSpot</h3>
              <p className="text-xs text-gray-500">Property Manager</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                {useAuth().user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate text-sm">
                  {useAuth().user?.displayName || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {useAuth().user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Main Menu
          </div>
          <Link href={'/dashboard'} onClick={handleLinkClick}>
            <NavItem icon={Home} active={isActive('/dashboard')}>
              Dashboard
            </NavItem>
          </Link>
          <Link href={'/dashboard/properties'} onClick={handleLinkClick}>
            <NavItem icon={Building} active={isActive('/dashboard/properties')}>
              My Properties
            </NavItem>
          </Link>
          <Link href={'/dashboard/list-property'} onClick={handleLinkClick}>
            <NavItem icon={Plus} active={isActive('/dashboard/list-property')}>
              List Property
            </NavItem>
          </Link>
          <Link href={'/dashboard/messages'} onClick={handleLinkClick}>
            <NavItem icon={MessageSquare} active={isActive('/dashboard/messages')} badge={3}>
              Messages
            </NavItem>
          </Link>
        </nav>

        {/* Account Section */}
        <nav className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Account
          </div>
          <Link href={'/dashboard/profile'} onClick={handleLinkClick}>
            <NavItem icon={User} active={isActive('/dashboard/profile')}>
              My Profile
            </NavItem>
          </Link>
          <Link href={'/dashboard/notification'} onClick={handleLinkClick}>
            <NavItem icon={Bell} active={isActive('/dashboard/notification')} badge={5}>
              Notifications
            </NavItem>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-gray-200 space-y-2">
          <Link href={'/dashboard/settings'} onClick={handleLinkClick}>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Settings size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="flex-1">Settings</span>
            </button>
          </Link>

          <button 
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="flex-1">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}