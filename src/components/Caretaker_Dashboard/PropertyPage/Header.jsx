import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-white p-6 border-b border-gray-200">
      {/* Search Bar */}
      <div className="flex items-center space-x-3 w-1/2">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search property, id ...."
          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-6">
        <button className="relative">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>

        <select className="border border-gray-300 rounded-md py-1 px-2 text-gray-700">
          <option>ENG</option>
          <option>FR</option>
          <option>ES</option>
        </select>

        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-gray-700">
            <p className="font-semibold">Franck Rodrick</p>
            <p className="text-xs text-gray-400">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;