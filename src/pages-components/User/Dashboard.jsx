import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
// NOTE: This file is kept for backward compatibility but the actual routing
// is now handled by /app/dashboard/user/* pages
export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {loadingUser, firebaseUser, user} = useAuth();
  const router = useRouter();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(()=>{
    if(loadingUser) return;
    if(!firebaseUser) return router.push('/login');
  }, [loadingUser, firebaseUser, router])

  if(loadingUser) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='factory-stack' />
      </div>
    )
  }

  // This component is deprecated - routing is now handled by Next.js App Router
  // Redirect to the new dashboard structure
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100/30 flex items-center justify-center">
      <Loader style='factory-stack' />
    </div>
  );
}