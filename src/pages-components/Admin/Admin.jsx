'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../../App.css';
import Sidebar from './Components/Sidebar';
import Main from './Components/Main';
import Property from './Components/Property/Property';
import Clients from './Components/Clients';
import Caretakers from './Components/Caretakers';
import HouseAgents from './Components/HouseAgents';
import Blogs from './Components/Blogs';
import Notification from './Components/Notification';
import Members from './Components/Members';
import Settings from './Components/Settings';

function Admin() {
  // Shared state for sidebar collapse - controls main content width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Determine active view based on pathname
  const getActiveView = () => {
    const path = pathname.split('/').pop();
    if (path && path !== 'dashboard') {
      return path;
    }
    return 'dashboard';
  };

  const activeView = getActiveView();

  // Render the appropriate view based on pathname
  const renderView = () => {
    switch (activeView) {
      case 'properties':
        return <Property isSidebarCollapsed={isSidebarCollapsed} />;
      case 'clients':
        return <Clients isSidebarCollapsed={isSidebarCollapsed} />;
      case 'caretakers':
        return <Caretakers isSidebarCollapsed={isSidebarCollapsed} />;
      case 'house-agents':
        return <HouseAgents isSidebarCollapsed={isSidebarCollapsed} />;
      case 'blogs':
        return <Blogs isSidebarCollapsed={isSidebarCollapsed} />;
      case 'notification':
        return <Notification isSidebarCollapsed={isSidebarCollapsed} />;
      case 'members':
        return <Members isSidebarCollapsed={isSidebarCollapsed} />;
      case 'settings':
        return <Settings isSidebarCollapsed={isSidebarCollapsed} />;
      case 'dashboard':
      default:
        return <Main isSidebarCollapsed={isSidebarCollapsed} />;
    }
  };

  return (
    <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeView={activeView}
      />
      {renderView()}
    </section>
  )
}

export default Admin