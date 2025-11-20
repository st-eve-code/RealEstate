import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardContent from '../../components/User_Dashboard/Dashboard';
import Property from '../../components/User_Dashboard/Properties';
import Profile from '../../components/User_Dashboard/Profile';
import Notification from '../../components/User_Dashboard/Notification';
import Transaction from '../../components/User_Dashboard/Transaction';
import Store from '../../components/User_Dashboard/Store';
import Subscription from '../../components/User_Dashboard/Subscription';
import HelpSection from '../../components/User_Dashboard/Help';
import Setting from '../../components/User_Dashboard/Setting';

// Main Dashboard Component
export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100/30 block md:flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <MainContent isSidebarCollapsed={isSidebarCollapsed}>
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="properties" element={<Property />} />
          <Route path="profile" element={<Profile />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="store" element={<Store />} />
          <Route path="notification" element={<Notification />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="help" element={<HelpSection />} />
          <Route path="setting" element={<Setting />} />
        </Routes>
      </MainContent>
    </div>
  );
}