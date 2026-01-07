'use client'

import React, { useState } from 'react';
// React Router removed - using Next.js App Router
import '../../App.css';
import Sidebar from './Components/Sidebar';
import Main from './Components/Main';
import Clients from './Components/Clients';
import Caretakers from './Components/Caretakers';
import HouseAgents from './Components/HouseAgents';
import Blogs from './Components/Blogs';
import Notification from './Components/Notification';
import Members from './Components/Members';

function Admin() {
  // Shared state for sidebar collapse - controls main content width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <Main isSidebarCollapsed={isSidebarCollapsed} />
    </section>
  )
}

export default Admin