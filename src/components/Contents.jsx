// In your Contents.jsx file:
import React, { memo } from 'react';
import Dashboard from '../components/Base_Contents/Dashboard';
import Property from '../components/Base_Contents/Properties';
import Profile from '../components/Base_Contents/Profile';
import Notification from '../components/Base_Contents/Notification';
import Transaction from '../components/Base_Contents/Transaction';
import Store from '../components/Base_Contents/Store';
import Subscription from '../components/Base_Contents/Subscription';

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
        return <div className="p-6">Help content here</div>;
      
      case 'darkmode':
        return <div className="p-6">Dark mode settings here</div>;
      
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