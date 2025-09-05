import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Hamburger for small screens */}
      <div className="md:hidden p-4">
        <button onClick={() => setOpen(!open)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 w-64 p-6 shadow-md md:block ${
          open ? 'block' : 'hidden'
        } fixed md:relative h-full z-20`}
      >
        <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-6">Rentspot</h2>
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
