import React from 'react'
import Dashboard from '../components/Base_Contents/Dashboard';
import Property from '../components/Base_Contents/Properties';
import Profile from '../components/Base_Contents/Profile';
import Notification from '../components/Base_Contents/Notification';
import Transaction from '../components/Base_Contents/Transaction';
import Store from '../components/Base_Contents/Store';
import Subscription from '../components/Base_Contents/Subscription';
import Logout from './Base_Contents/Logout';
function Contents({data, isSidebarCollapsed}) {
    const renderContent = () => {
         switch(data) {
                case 'dashboard':
                    return <Dashboard/>;
                case 'properties':
                    return <Property/>;
                case 'profile':
                    return <Profile/>;
                case 'transaction':
                    return <Transaction/>;
                case 'store':
                    return <Store sidebar={isSidebarCollapsed}/>;
                case 'notification':
                    return <Notification/>;
                case 'subscription':
                    return <Subscription/>;
                case 'logout':
                    return <Logout/>;
                default:
                    return <Dashboard/>;
            };
    }
    return <div>{renderContent()}</div>
}

export default Contents