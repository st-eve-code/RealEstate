// In your Contents.jsx file:
import React, { memo } from 'react';
import Dashboard from './User_Dashboard/Dashboard';
import Property from './User_Dashboard/Properties';
import Profile from './User_Dashboard/Profile';
import Notification from './User_Dashboard/Notification';
import Transaction from './User_Dashboard/Transaction';
import Store from './User_Dashboard/Store';
import Subscription from './User_Dashboard/Subscription';
import HelpSection from './User_Dashboard/Help';
import Setting from './User_Dashboard/Setting';

function Contents({ data = 'dashboard', isSidebarCollapsed = false }) {
  const renderContent = () => {
    switch (data) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'properties':
        return <Property />;
      
      case 'profile':
        return <Profile />;
      
      case 'transaction':
        return <Transaction />;
      
      case 'store':
        return <Store isSidebarCollapsed={isSidebarCollapsed} />;
      
      case 'notification':
        return <Notification />;
      
      case 'subscription':
        return <Subscription />;
      
      case 'help':
        return <HelpSection />;
      
      case 'setting':
        return <Setting />;
      
      // Don't render logout as content - it's handled by modal
      case 'logout':
        return null;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="animate-fadeIn">
      {renderContent()}
    </div>
  );
}

export default memo(Contents);