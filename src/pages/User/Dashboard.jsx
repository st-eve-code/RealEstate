import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardContent from '../../components/User_Dashboard/Dashboard';
import Property from '../../components/User_Dashboard/Properties';
import Profile from '../../components/User_Dashboard/Profile';
import Notification from '../../components/User_Dashboard/Notification';
import Transaction from '../../components/User_Dashboard/Transaction';
import Store from '../../components/User_Dashboard/Store';
import Subscription from '../../components/User_Dashboard/Subscription';
import HelpSection from '../../components/User_Dashboard/Help';
import Setting from '../../components/User_Dashboard/Setting';
import { useAuth } from '@/lib/auth-context';
import Loader from '@/components/ado/loader';

// Main Dashboard Component
export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {loadingUser, firebaseUser, user} = useAuth();
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  const navigate = useNavigate();

  useEffect(()=>{
    if(loadingUser) return;
    if(!firebaseUser) return navigate('/login');
  }, [loadingUser, firebaseUser, navigate])

  if(loadingUser) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='factory-stack' />
      </div>
    )
  }

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
          <Route path="profile" element={<Profile user={user} />} />
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