import React from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NavItem = ({children, active, onClick} = {}) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
      active ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'
    }`}
  >
    <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm">•</span>
    <span className="font-medium">{children}</span>
  </button>
)

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }){
  const location = useLocation();

  // Determine active route
  const isActive = (path) => {
    if (path === '/caretaker-dashboard') {
      return location.pathname === '/caretaker-dashboard' || location.pathname === '/caretaker-dashboard/';
    }
    return location.pathname.startsWith(path);
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
          w-64 p-5 bg-gray-100 min-h-screen border-r shadow-md
          fixed md:sticky top-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">R</div>
          <div>
            <h3 className="font-bold">RentSpot</h3>
            <p className="text-xs text-gray-500">Caretaker</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link to={'/caretaker-dashboard'} onClick={handleLinkClick}>
            <NavItem active={isActive('/caretaker-dashboard')}>Dashboard</NavItem>
          </Link>
          <Link to={'/caretaker-dashboard/properties'} onClick={handleLinkClick}>
            <NavItem active={isActive('/caretaker-dashboard/properties')}>My Properties</NavItem>
          </Link>
          <Link to={'/caretaker-dashboard/list-property'} onClick={handleLinkClick}>
            <NavItem active={isActive('/caretaker-dashboard/list-property')}>List Property</NavItem>
          </Link>
          <NavItem>My Profile</NavItem>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-8">
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm bg-white shadow hover:bg-gray-50 transition-colors">
            Settings
          </button>

          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm mt-3 text-red-600 bg-white/60 hover:bg-white transition-colors">
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}