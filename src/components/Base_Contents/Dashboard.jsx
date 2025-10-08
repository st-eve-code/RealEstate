import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Plus, Eye, Coins, UserCircle, BookOpen } from 'lucide-react';
import banner from  '../../assets/images/banner.jpg';
import { Chart } from 'chart.js/auto';

// Charts Component with proper sizing and different data sets
function Charts({ Graph, isSmall = false, dataType = 'sales' }) {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
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
        label: 'Property Types Searched'
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
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: isSmall ? 1 : 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: !isSmall,
            position: Graph === 'pie' ? 'bottom' : 'top'
          },
          tooltip: {
            enabled: !isSmall
          }
        },
        scales: Graph === 'pie' ? {} : {
          y: {
            beginAtZero: true,
            display: !isSmall,
            grid: {
              display: !isSmall
            }
          },
          x: {
            display: !isSmall,
            grid: {
              display: false
            }
          }
        }
      }
    };
    
    const chart = new Chart(ctx, config);
    
    return () => chart.destroy();
  }, [Graph, isSmall, dataType]);
  
  return (
    <canvas ref={chartRef} className="w-full h-full"></canvas>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [language, setLanguage] = useState('EN');
  const [isDropdown, setDropdown] = useState(false);
  
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
      detail: '10',
      season: 'last month',
      rate: 0.8,
      dataType: 'views'
    },
    {
      icon: Coins,
      title: 'My Plan',
      graph: 'line',
      detail: 'Basic',
      season: 'last month',
      rate: 2.5,
      dataType: 'sales'
    },
    {
      icon: UserCircle,
      title: 'Total Users',
      graph: 'pie',
      detail: '1000+',
      season: 'last month',
      rate: 0.8,
      dataType: 'users'
    },
    {
      icon: BookOpen,
      title: 'Total Rents',
      graph: 'line',
      detail: '300+',
      season: 'last month',
      rate: 3.2,
      dataType: 'rents'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h1 className="font-bold text-lg text-gray-600">Dashboard</h1>
          <div className="flex justify-start sm:justify-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <button 
                onClick={() => setDropdown(!isDropdown)} 
                type="button" 
                className="bg-white shadow rounded-lg flex justify-center gap-2 px-2 sm:px-3 py-2 items-center"
              >
                <Languages size={15} className="text-blue-500"/>
                <p className="font-medium text-xs sm:text-sm text-gray-600">{language}</p>
                <ChevronDown size={15} className={`text-gray-600 transition-transform ${isDropdown ? '-rotate-90' : ''}`}/>
              </button>
              {isDropdown && (
                <div className="absolute z-10 w-16 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(option)}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="bg-blue-600 rounded-lg flex justify-center gap-1 px-3 sm:px-4 py-2 items-center">
              <Plus size={18} className="text-white"/>
              <p className="font-medium text-xs sm:text-sm text-white">Add Property</p>
            </button>
          </div>
        </div>
        
        {/* User Details Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {userDetails.map((data, index) => {
            const Icon = data.icon;
            return (
              <div key={index} className="p-3 sm:p-4 rounded-lg shadow-md bg-white">
                <div className="flex justify-start items-center gap-2 mb-2 sm:mb-3">
                  <Icon size={15} className="text-blue-600"/>
                  <h1 className="font-medium text-gray-600 text-xs sm:text-sm">{data.title}</h1>
                </div>
                <div className="flex justify-between items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <p className="font-bold text-gray-800 text-base sm:text-lg">{data.detail}</p>
                  <div className="w-16 h-10 sm:w-20 sm:h-12">
                    <Charts Graph={data.graph} isSmall={true} dataType={data.dataType}/>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button className={`${data.rate >= 1 ? 'text-green-400 bg-green-100' : 'text-red-400 bg-red-100'} px-2 py-1 font-medium text-xs rounded-lg`}>
                    {data.rate}%
                  </button>
                  <p className="font-normal text-gray-400 text-xs">{data.season}</p>
                </div>
              </div>
            );
          })}
        </section>
        {/* Advertisement Banner */}
        <section className="p-3 sm:p-4 my-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6" style={{backgroundImage: `url(${banner})`,backgroundPosition:'center',backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}>
          <div className="flex-1 w-full">
            <p className="font-normal text-white text-xs sm:text-sm mb-1">
              74 tenants have been submitted recently, please check it out!
            </p>
            <p className="font-normal text-white/50 text-xs">
              Follow us for more new updates like this.
            </p>
          </div>
          <button className="bg-white/20 font-medium text-white text-xs sm:text-sm backdrop-blur-md px-4 py-2 rounded-lg shrink-0 w-full sm:w-auto">
            60% off
          </button>
        </section>
        
        {/* Statistics Section */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:col-span-7 lg:col-span-8">
            <h1 className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Recent Activities</h1>
            <p className="font-medium text-gray-600 text-xs mb-3 sm:mb-4">
              Take a look at the visual records of all your activities
            </p>
            <div className="w-full h-56 sm:h-64 md:h-80">
              <Charts Graph="bar" isSmall={false} dataType="views"/>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 md:col-span-5 lg:col-span-4">
            <h1 className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Distribution</h1>
            <p className="font-medium text-gray-600 text-xs mb-3 sm:mb-4">
              Visual breakdown of property categories
            </p>
            <div className="w-full h-56 sm:h-64 md:h-80">
              <Charts Graph="pie" isSmall={false} dataType="propertyTypes"/>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;