'use client'

import { Bell, Search, Users, Building, DollarSign, TrendingUp, Eye, MessageSquare, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import avatar from '../../../assets/images/tiger.jpg'
import React, { useState } from 'react';
import Charts from '../../../components/Chart';
import RevenueAnalyticsChart from '../../../components/RevenueAnalyticsChart';
import NewGrowthChart from '../../../components/NewGrowthChart';
import { useAdminStats, useActivityLogs } from '../../../Hooks/useAdminStats';

function Main({ isSidebarCollapsed }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [timeRange, setTimeRange] = useState(30); // Default to 30 days
  const [growthViewMode, setGrowthViewMode] = useState('monthly'); // daily, monthly, yearly
  const [growthTimeRange, setGrowthTimeRange] = useState(30); // For daily view
  const [activityFilter, setActivityFilter] = useState('all'); // all, user, property, payment

  // Fetch real stats from Firebase
  const { stats, loading: statsLoading } = useAdminStats();
  const { activities, loading: activitiesLoading, totalCount } = useActivityLogs(activityFilter, 10);

  const systemHealth = {
    serverStatus: 'Operational',
    uptime: '99.9%',
    responseTime: '245ms',
    activeSessions: stats.totalUsers > 0 ? Math.floor(stats.totalUsers * 0.15) : 0 // Estimate 15% active
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // In a real app, you'd search across users and properties collections
      // For now, we'll show a message
      setTimeout(() => {
        setIsSearching(false);
        alert(`Search functionality would search for: "${searchTerm}" across users and properties`);
      }, 500);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };


  return (
    <section className={`bg-gray-50 w-full min-h-screen  p-6 px-6 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-60 lg:ml-72'
    }`}>
      {/* Navigation Header */}
      <nav className='p-2 mb-6 bg-white rounded-lg shadow-sm max-md:mt-14'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h1 className='text-xl font-bold text-gray-800 font-Custom'>Admin Dashboard</h1>

          <div className='flex items-center gap-4'>
            {/* Search Section */}
            <form onSubmit={handleSearch} className='relative'>
              <div className='flex items-center w-full transition-colors border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300'>
                <Search className='ml-3 text-gray-400 ' size={18}/>
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder='Search users, properties...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-2 pr-4 text-sm font-medium text-gray-700 bg-transparent outline-none  font-Poppins"
                />
                <button 
                  type='submit' 
                  disabled={isSearching}
                  className='px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 font-Poppins'
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Notifications and Avatar */}
            <div className='flex items-center gap-3 max-md:hidden'>
              <div className='relative'>
                <Bell className='text-gray-600 transition-colors cursor-pointer hover:text-gray-800' size={20} />
                <span className='absolute inline-block w-3 h-3 bg-red-500 rounded-full -top-1 -right-1'></span>
              </div>
              <img src={avatar.src || avatar} alt="Admin Avatar" className='w-8 h-8 transition-colors border-2 border-gray-200 rounded-full cursor-pointer hover:border-gray-300' />
            </div>
          </div>
        </div>
      </nav>

      {/* Key Metrics Overview */}
      <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-3'>
        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>Platform Overview</h3>
              <p className='text-sm text-gray-600'>Key performance indicators</p>
            </div>
            <div className='p-3 bg-blue-100 rounded-full'>
              <TrendingUp className='text-blue-600' size={24} />
            </div>
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Total Users</span>
                <span className='font-semibold text-gray-900'>{stats.totalUsers.toLocaleString()}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Active Properties</span>
                <span className='font-semibold text-gray-900'>{stats.activeListings}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Occupancy Rate</span>
                <span className='font-semibold text-green-600'>{stats.occupancyRate}%</span>
              </div>
            </div>
          )}
        </div>

        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>Revenue & Growth</h3>
              <p className='text-sm text-gray-600'>Financial performance</p>
            </div>
            <div className='p-3 bg-green-100 rounded-full'>
              <DollarSign className='text-green-600' size={24} />
            </div>
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Monthly Revenue</span>
                <span className='font-semibold text-gray-900'>${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Growth Rate</span>
                <span className={`font-semibold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth}%
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>New Users (Month)</span>
                <span className='font-semibold text-blue-600'>{stats.newUsersThisMonth}</span>
              </div>
            </div>
          )}
        </div>

        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>System Health</h3>
              <p className='text-sm text-gray-600'>Platform status & performance</p>
            </div>
            <div className='p-3 bg-purple-100 rounded-full'>
              <Settings className='text-purple-600' size={24} />
            </div>
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Server Status</span>
                <span className='font-semibold text-green-600'>{systemHealth.serverStatus}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Uptime</span>
                <span className='font-semibold text-gray-900'>{systemHealth.uptime}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Active Sessions</span>
                <span className='font-semibold text-blue-600'>{systemHealth.activeSessions}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Analytics Chart - Cumulative Growth */}
      <div className='p-6 mb-8 bg-white rounded-lg shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>Revenue Analytics</h3>
            <p className='text-sm text-gray-600'>Revenue growth and user acquisition over time (Cumulative)</p>
          </div>
          <div className='flex items-center space-x-2'>
            <button 
              onClick={() => setTimeRange(7)}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                timeRange === 7 ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeRange(30)}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                timeRange === 30 ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              30D
            </button>
            <button 
              onClick={() => setTimeRange(90)}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                timeRange === 90 ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              90D
            </button>
          </div>
        </div>
        <div className='h-80'>
          <RevenueAnalyticsChart timeRange={timeRange} />
        </div>
      </div>

      {/* New Growth Chart - Incremental Growth */}
      <div className='p-6 mb-8 bg-white rounded-lg shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>Incremental Growth Analytics</h3>
            <p className='text-sm text-gray-600'>New revenue and new users per period (Non-cumulative)</p>
          </div>
          <div className='flex items-center space-x-2'>
            <button 
              onClick={() => {
                setGrowthViewMode('daily')
                setGrowthTimeRange(7)
              }}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                growthViewMode === 'daily' ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button 
              onClick={() => setGrowthViewMode('monthly')}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                growthViewMode === 'monthly' ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setGrowthViewMode('yearly')}
              className={`px-3 py-1 text-sm transition-colors rounded-md ${
                growthViewMode === 'yearly' ? 'text-white bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
            {growthViewMode === 'daily' && (
              <>
                <span className='mx-2 text-gray-300'>|</span>
                <button 
                  onClick={() => setGrowthTimeRange(7)}
                  className={`px-3 py-1 text-sm transition-colors rounded-md ${
                    growthTimeRange === 7 ? 'text-white bg-green-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  7D
                </button>
                <button 
                  onClick={() => setGrowthTimeRange(30)}
                  className={`px-3 py-1 text-sm transition-colors rounded-md ${
                    growthTimeRange === 30 ? 'text-white bg-green-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  30D
                </button>
              </>
            )}
          </div>
        </div>
        <div className='h-80'>
          <NewGrowthChart viewMode={growthViewMode} timeRange={growthTimeRange} />
        </div>
        <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100'>
          <p className='text-sm text-blue-800'>
            <strong>Note:</strong> This chart shows <strong>new</strong> growth per period. 
            {growthViewMode === 'daily' && ' Each bar represents new users and revenue added that day.'}
            {growthViewMode === 'monthly' && ' Each bar represents new users and revenue added that month.'}
            {growthViewMode === 'yearly' && ' Each bar represents new users and revenue added that year.'}
          </p>
        </div>
      </div>

      {/* Detailed Activity Log */}
      <div className='p-6 bg-white rounded-lg shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>Activity Log</h3>
            <p className='text-sm text-gray-600'>Real-time system activities and user interactions</p>
          </div>
          <div className='flex items-center space-x-3'>
            <select 
              value={activityFilter} 
              onChange={(e) => setActivityFilter(e.target.value)}
              className='px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="all">All Activities</option>
              <option value="user">User Actions</option>
              <option value="property">Property Updates</option>
              <option value="payment">Payments</option>
            </select>
            <button className='text-sm font-medium text-blue-600 hover:text-blue-800'>Export</button>
          </div>
        </div>

        {activitiesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading activities...</p>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-600">No activities found</p>
              <p className="mt-1 text-xs text-gray-500">Activities will appear here as they occur</p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {activities.map((activity) => (
            <div key={activity.id} className='flex items-center justify-between p-4 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50'>
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
                  <p className='mt-1 text-sm text-gray-600'>{activity.details}</p>
                  <div className='flex items-center mt-2 space-x-4'>
                    <span className='text-xs text-gray-500'>by {activity.user}</span>
                    <span className='text-xs text-gray-500'>{activity.time}</span>
                    {activity.value && (
                      <span className='text-xs font-medium text-blue-600'>{activity.value}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex space-x-2'>
                <button className='p-2 text-gray-400 transition-colors rounded-md hover:text-blue-600 hover:bg-blue-50'>
                  <Eye size={16} />
                </button>
                <button className='p-2 text-gray-400 transition-colors rounded-md hover:text-green-600 hover:bg-green-50'>
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        <div className='flex items-center justify-between pt-4 mt-6 border-t border-gray-100'>
          <p className='text-sm text-gray-600'>
            Showing {activities.length} {activityFilter === 'all' ? 'activities' : `${activityFilter} activities`}
            {totalCount > 0 && ` of ${totalCount} total`}
          </p>
          <div className='text-xs text-gray-500'>
            Live data from Firebase
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main