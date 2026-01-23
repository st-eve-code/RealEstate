'use client'

import React, { useState } from 'react';
import { Users, Award } from 'lucide-react';
import MembersManagement from '@/components/Admin/MembersManagement';
import PlanManagement from '@/components/Admin/PlanManagement';

function MembersWithPlans({ isSidebarCollapsed }) {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <section className={`bg-gray-50 max-md:mt-14 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Members & Plans Management</h1>
          <p className="mt-2 text-gray-600">Manage your members and subscription plans</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'members'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={20} />
            Members
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'plans'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award size={20} />
            Plans
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'members' && <MembersManagement isSidebarCollapsed={isSidebarCollapsed} />}
          {activeTab === 'plans' && <PlanManagement isSidebarCollapsed={isSidebarCollapsed} />}
        </div>
      </div>
    </section>
  );
}

export default MembersWithPlans;
