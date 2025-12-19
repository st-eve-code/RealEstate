import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../../App.css';
import Sidebar from './Components/Sidebar';
import Main from './Components/Main';
import Clients from './Components/Clients';
import Caretakers from './Components/Caretakers';
import HouseAgents from './Components/HouseAgents';
import Blogs from './Components/Blogs';
import Notification from './Components/Notification';
import Members from './Components/Members';
import Settings from './Components/Settings';
import Property from './Components/Property';

function Admin() {
  // Shared state for sidebar collapse - controls main content width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <Routes>
        <Route index element={<Main isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/clients" element={<Clients isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/caretakers" element={<Caretakers isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/house-agents" element={<HouseAgents isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/properties" element={<Property isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/blogs" element={<Blogs isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/notification" element={<Notification isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/members" element={<Members isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="dashboard/settings/*" element={<Settings isSidebarCollapsed={isSidebarCollapsed} />} />
      </Routes>
    </section>
  )
}

export default Admin