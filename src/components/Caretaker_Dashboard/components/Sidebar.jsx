import React from 'react'
import {HomeIcon, BuildingOfficeIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon} from '@reacticons/ionicons';
import { Link } from 'react-router-dom';
import PropertyPage from '@/pages/Caretaker/PropertyPage';

const NavItem = ({children, active}) => (
  <button className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${active ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>
    <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm">•</span>
    <span className="font-medium">{children}</span>
  </button>
)

export default function Sidebar(){
  return (
    <aside className="w-64 p-5 bg-gray-100 min-h-screen border-r shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">R</div>
        <div>
          <h3 className="font-bold">RentSpot</h3>
          <p className="text-xs text-gray-500">Caretaker</p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavItem active>Dashboard</NavItem>
        <Link to={PropertyPage}><NavItem>Properties</NavItem></Link>
        <NavItem>My Profile</NavItem>
      </nav>

      <div className="mt-8">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm bg-white shadow">
          <Cog6ToothIcon />
          Settings
        </button>

        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm mt-3 text-red-600 bg-white/60">
          Logout
        </button>
      </div>
    </aside>
  )
}