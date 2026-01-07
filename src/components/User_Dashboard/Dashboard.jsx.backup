import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Plus, Eye, Coins, UserCircle, BookOpen } from 'lucide-react';
import { Chart } from 'chart.js/auto';
import { useAuth } from '@/lib/auth-context';

// Placeholder images
const banner = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop";

// Charts Component
function Charts({ Graph, isSmall = false, dataType = 'sales' }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
    // Destroy existing chart before creating new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    // Colorful palette for all chart types
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
      '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#a855f7'
    ];
    
    const borderColors = [
      '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2',
      '#db2777', '#0d9488', '#ea580c', '#4f46e5', '#65a30d', '#9333ea'
    ];
    
    // Different datasets based on dataType
    const datasets = {
      sales: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [12, 19, 3, 5, 8, 10, 64, 5, 10, 30, 4, 12],
        label: 'Sales'
      },
      views: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [150, 230, 180, 290, 320, 410, 380, 450, 390, 520, 480, 550],
        label: 'Total Views'
      },
      propertyTypes: {
        labels: ['Apartments', 'Houses', 'Studios'],
        data: [35, 28, 15],
        label: 'Property Types'
      },
      users: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [45, 67, 89, 102, 134, 156, 178, 201, 234, 267, 289, 312],
        label: 'User Growth'
      },
      rents: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [8, 15, 12, 18, 22, 28, 35, 30, 38, 42, 45, 52],
        label: 'Monthly Rents'
      }
    };
    
    const currentData = datasets[dataType] || datasets.sales;
    
    // Configuration based on chart size
    const config = {
      type: Graph,
      data: {
        labels: currentData.labels,
        datasets: [{
          label: currentData.label,
          data: currentData.data,
          backgroundColor: Graph === 'pie' ? colors : colors[0],
          borderColor: Graph === 'pie' ? borderColors : borderColors[0],
          borderWidth: isSmall ? 1 : 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: !isSmall,
            position: Graph === 'pie' ? 'bottom' : 'top',
            labels: {
              padding: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 10,
            cornerRadius: 6
          }
        },
        scales: Graph === 'pie' ? {} : {
          y: {
            beginAtZero: true,
            display: !isSmall,
            grid: {
              display: !isSmall,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          x: {
            display: !isSmall,
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        }
      }
    };
    
    chartInstance.current = new Chart(ctx, config);
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [Graph, isSmall, dataType]);
  
  return (
    <canvas ref={chartRef} className="w-full h-full"></canvas>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [language, setLanguage] = useState('EN');
  const [isDropdown, setDropdown] = useState(false);
  const {user} = useAuth();
  
  const handleSelect = (option) => {
    setLanguage(option);
    setDropdown(false);
  };
  
  const options = ['EN', 'FR'];

  const userDetails = [
    {
      icon: Eye,
      title: 'Total Views',
      graph: 'bar',
      detail: '10K',
      season: 'last month',
      rate: 8.5,
      isPositive: true,
      dataType: 'views'
    },
    {
      icon: Coins,
      title: 'My Plan',
      graph: 'line',
      detail: 'Basic',
      season: 'last month',
      rate: 2.5,
      isPositive: true,
      dataType: 'sales'
    },
    {
      icon: UserCircle,
      title: 'Total Users',
      graph: 'pie',
      detail: '1000+',
      season: 'last month',
      rate: 12.3,
      isPositive: true,
      dataType: 'users'
    },
    {
      icon: BookOpen,
      title: 'Total Rents',
      graph: 'line',
      detail: '300+',
      season: 'last month',
      rate: 3.2,
      isPositive: true,
      dataType: 'rents'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="font-bold text-xl sm:text-2xl text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setDropdown(!isDropdown)} 
                type="button" 
                className="bg-white shadow-sm border border-gray-200 rounded-lg flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <Languages size={16} className="text-blue-600"/>
                <span className="font-medium text-sm text-gray-700">{language}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdown ? 'rotate-180' : ''}`}/>
              </button>
              
              {isDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdown(false)}
                  />
                  <div className="absolute right-0 z-20 w-24 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(option)}
                        className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          language === option 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Add Property Button */}
            <button 
              type="button" 
              className="bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 px-4 py-2 shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={18} className="text-white"/>
              <span className="font-medium text-sm text-white">Add Property</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {userDetails.map((data, index) => {
            const Icon = data.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon size={18} className="text-blue-600"/>
                  </div>
                  <h2 className="font-semibold text-gray-700 text-sm">{data.title}</h2>
                </div>
                
                <div className="flex justify-between items-center gap-4 mb-3">
                  <p className="font-bold text-gray-900 text-2xl">{data.detail}</p>
                  <div className="w-20 h-12">
                    <Charts Graph={data.graph} isSmall={true} dataType={data.dataType}/>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${
                    data.isPositive 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  } px-2.5 py-1 font-semibold text-xs rounded-md`}>
                    {data.isPositive ? '+' : '-'}{data.rate}%
                  </span>
                  <p className="font-medium text-gray-400 text-xs">{data.season}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 shadow-sm">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg sm:text-xl mb-2">
                Special Offer! 🎉
              </h3>
              <p className="text-white/90 text-sm sm:text-base mb-1">
                74 tenants have been submitted recently, check them out!
              </p>
              <p className="text-white/60 text-xs sm:text-sm">
                Follow us for more updates like this.
              </p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md font-semibold text-white text-sm px-6 py-3 rounded-lg transition-all shadow-lg">
              60% Off
            </button>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:col-span-7">
            <div className="mb-4">
              <h2 className="font-bold text-gray-800 text-lg mb-1">Recent Activities</h2>
              <p className="text-gray-500 text-sm">
                Visual records of all your activities over time
              </p>
            </div>
            <div className="w-full h-64 sm:h-72 lg:h-80">
              <Charts Graph="bar" isSmall={false} dataType="views"/>
            </div>
          </div>
          
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:col-span-5">
            <div className="mb-4">
              <h2 className="font-bold text-gray-800 text-lg mb-1">Distribution</h2>
              <p className="text-gray-500 text-sm">
                Property categories breakdown
              </p>
            </div>
            <div className="w-full h-64 sm:h-72 lg:h-80">
              <Charts Graph="pie" isSmall={false} dataType="propertyTypes"/>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;