import { Bell, Search, Users, Building, DollarSign, TrendingUp, Eye, MessageSquare, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import avatar from '../../../assets/images/tiger.jpg'
import React, { useState } from 'react';
import Charts from '../../../components/Chart';

function Main({ isSidebarCollapsed }) {
  // Mock data - in real app, this would come from API
  const [stats] = useState({
    totalUsers: 1247,
    totalProperties: 89,
    totalRevenue: 45680,
    monthlyGrowth: 12.5,
    activeListings: 67,
    occupancyRate: 89,
    newUsersThisMonth: 156,
    propertiesAddedThisMonth: 12
  });

  const [systemHealth] = useState({
    serverStatus: 'Operational',
    uptime: '99.9%',
    responseTime: '245ms',
    activeSessions: 89
  });

  const [detailedActivities] = useState([
    {
      id: 1,
      action: 'Property Listed',
      details: 'Luxury 3BR Apartment in Downtown',
      user: 'John Doe',
      time: '2 hours ago',
      type: 'property',
      value: '$2,500/month',
      status: 'active'
    },
    {
      id: 2,
      action: 'User Registration',
      details: 'New landlord account created',
      user: 'Sarah Wilson',
      time: '4 hours ago',
      type: 'user',
      value: 'Premium Plan',
      status: 'verified'
    },
    {
      id: 3,
      action: 'Payment Processed',
      details: 'Monthly subscription payment',
      user: 'Mike Johnson',
      time: '6 hours ago',
      type: 'payment',
      value: '$49.99',
      status: 'completed'
    },
    {
      id: 4,
      action: 'Property Updated',
      details: 'Price adjustment and new photos',
      user: 'Emma Davis',
      time: '8 hours ago',
      type: 'property',
      value: '$800 → $850',
      status: 'updated'
    },
    {
      id: 5,
      action: 'Support Ticket',
      details: 'Property verification request',
      user: 'Robert Brown',
      time: '12 hours ago',
      type: 'support',
      value: 'High Priority',
      status: 'resolved'
    }
  ]);

  return (
    <section className={`bg-gray-50 w-full min-h-screen p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      {/* Navigation Header */}
      <nav className='bg-white rounded-lg shadow-sm p-4 mb-6'>
        <div className='flex justify-between items-center flex-wrap gap-4'>
          <h1 className='text-xl font-bold text-gray-800 font-Custom'>Admin Dashboard</h1>

          <div className='flex items-center gap-4'>
            {/* Search Section */}
            <div className='relative'>
              <div className='flex items-center bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors'>
                <Search className='ml-3 text-gray-400' size={18}/>
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder='Search users, properties...'
                  className="bg-transparent pl-2 pr-4 py-2 font-Poppins font-medium text-sm text-gray-700 outline-none w-64 lg:w-80"
                />
                <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white font-Poppins font-medium text-sm px-4 py-2 rounded-r-lg transition-colors'>
                  Search
                </button>
              </div>
            </div>

            {/* Notifications and Avatar */}
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Bell className='cursor-pointer text-gray-600 hover:text-gray-800 transition-colors' size={20} />
                <span className='absolute -top-1 -right-1 inline-block w-3 h-3 bg-red-500 rounded-full'></span>
              </div>
              <img src={avatar} alt="Admin Avatar" className='w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer' />
            </div>
          </div>
        </div>
      </nav>

      {/* Key Metrics Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>Platform Overview</h3>
              <p className='text-sm text-gray-600'>Key performance indicators</p>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <TrendingUp className='text-blue-600' size={24} />
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Total Users</span>
              <span className='font-semibold text-gray-900'>{stats.totalUsers.toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Active Properties</span>
              <span className='font-semibold text-gray-900'>{stats.activeListings}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Occupancy Rate</span>
              <span className='font-semibold text-green-600'>{stats.occupancyRate}%</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>Revenue & Growth</h3>
              <p className='text-sm text-gray-600'>Financial performance</p>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <DollarSign className='text-green-600' size={24} />
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Monthly Revenue</span>
              <span className='font-semibold text-gray-900'>${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Growth Rate</span>
              <span className='font-semibold text-green-600'>+{stats.monthlyGrowth}%</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>New Users (Month)</span>
              <span className='font-semibold text-blue-600'>{stats.newUsersThisMonth}</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>System Health</h3>
              <p className='text-sm text-gray-600'>Platform status & performance</p>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <Settings className='text-purple-600' size={24} />
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Server Status</span>
              <span className='font-semibold text-green-600'>{systemHealth.serverStatus}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Uptime</span>
              <span className='font-semibold text-gray-900'>{systemHealth.uptime}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Active Sessions</span>
              <span className='font-semibold text-blue-600'>{systemHealth.activeSessions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>Revenue Analytics</h3>
            <p className='text-sm text-gray-600'>Monthly performance trends and projections</p>
          </div>
          <div className='flex items-center space-x-2'>
            <button className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'>7D</button>
            <button className='px-3 py-1 text-sm bg-blue-600 text-white rounded-md'>30D</button>
            <button className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'>90D</button>
          </div>
        </div>
        <div className='h-80'>
          <Charts Graph="line" />
        </div>
      </div>

      {/* Detailed Activity Log */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>Activity Log</h3>
            <p className='text-sm text-gray-600'>Detailed system activities and user interactions</p>
          </div>
          <div className='flex items-center space-x-3'>
            <select className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>All Activities</option>
              <option>User Actions</option>
              <option>Property Updates</option>
              <option>Payments</option>
              <option>Support</option>
            </select>
            <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>Export</button>
          </div>
        </div>

        <div className='space-y-4'>
          {detailedActivities.map((activity) => (
            <div key={activity.id} className='flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors'>
              <div className='flex items-center space-x-4'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'property' ? 'bg-green-100' :
                  activity.type === 'payment' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {activity.type === 'user' && <Users size={20} className='text-blue-600' />}
                  {activity.type === 'property' && <Building size={20} className='text-green-600' />}
                  {activity.type === 'payment' && <DollarSign size={20} className='text-yellow-600' />}
                  {activity.type === 'support' && <MessageSquare size={20} className='text-red-600' />}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h4 className='font-medium text-gray-900'>{activity.action}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'active' ? 'bg-green-100 text-green-800' :
                      activity.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'verified' ? 'bg-purple-100 text-purple-800' :
                      activity.status === 'resolved' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>{activity.details}</p>
                  <div className='flex items-center space-x-4 mt-2'>
                    <span className='text-xs text-gray-500'>by {activity.user}</span>
                    <span className='text-xs text-gray-500'>{activity.time}</span>
                    {activity.value && (
                      <span className='text-xs font-medium text-blue-600'>{activity.value}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex space-x-2'>
                <button className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'>
                  <Eye size={16} />
                </button>
                <button className='p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors'>
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-100'>
          <p className='text-sm text-gray-600'>Showing 5 of 247 activities</p>
          <div className='flex space-x-2'>
            <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>Previous</button>
            <button className='px-3 py-1 text-sm bg-blue-600 text-white rounded-md'>1</button>
            <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>2</button>
            <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>3</button>
            <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>Next</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main