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
        <Route path="clients" element={<Clients isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="caretakers" element={<Caretakers isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="house-agents" element={<HouseAgents isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="properties" element={<Property isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="blogs" element={<Blogs isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="notification" element={<Notification isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="members" element={<Members isSidebarCollapsed={isSidebarCollapsed} />} />
        <Route path="settings/*" element={<Settings isSidebarCollapsed={isSidebarCollapsed} />} />
      </Routes>
    </section>
  )
}

export default Admin