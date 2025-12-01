import React from 'react';
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

function Admin() {
  return (
    <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
      <Sidebar />
      <Routes>
        <Route index element={<Main />} />
        <Route path="dashboard/clients" element={<Clients />} />
        <Route path="dashboard/caretakers" element={<Caretakers />} />
        <Route path="dashboard/house-agents" element={<HouseAgents />} />
        <Route path="dashboard/blogs" element={<Blogs />} />
        <Route path="dashboard/notification" element={<Notification />} />
        <Route path="dashboard/members" element={<Members />} />
        <Route path="dashboard/settings/*" element={<Settings />} />
      </Routes>
    </section>
  )
}

export default Admin