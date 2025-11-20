import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

function UserDashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSelect = (option) => {
    console.log('Selected:', option);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
        <main className="flex-1">
          <MainContent isSidebarCollapsed={isCollapsed}>
            <Outlet />
          </MainContent>
        </main>
      </div>
    </div>
  );
}

export default UserDashboardLayout;