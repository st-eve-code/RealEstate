'use client'

import React, { useState, useEffect } from 'react';
// React Router removed - using Next.js App Router
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
  const [activeView, setActiveView] = useState('dashboard');
  
  /* 
  // Handle hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveView(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render the appropriate view based on activeView
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
  }; */

  return (
    <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeView={activeView}
      />
      <Main isSidebarCollapsed={isSidebarCollapsed} />
      {/* {renderView()} */}
    </section>
  )
}

export default Admin