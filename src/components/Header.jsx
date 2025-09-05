import React from 'react';

import DarkModeToggle from './DarkModeToggle';

function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Hello, User 👋</h1>
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
