import React, { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function OverviewHeader({ stats }) {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Summary of your portfolio performance this month
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-900">
                {stats?.totalProperties || 0} Properties
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {stats?.activeListings || 0} Active
              </span>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl px-4 py-2 border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  );
}