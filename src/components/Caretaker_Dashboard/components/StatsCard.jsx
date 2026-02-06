import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50'
  },
  green: {
    bg: 'bg-green-100',
    iconColor: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600',
    lightBg: 'bg-green-50'
  },
  purple: {
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    lightBg: 'bg-purple-50'
  },
  orange: {
    bg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    lightBg: 'bg-orange-50'
  },
  red: {
    bg: 'bg-red-100',
    iconColor: 'text-red-600',
    gradient: 'from-red-500 to-red-600',
    lightBg: 'bg-red-50'
  }
};

export default function StatsCard({ title, value, icon: Icon, color = 'blue', trend }) {
  const colors = colorClasses[color];
  const isPositive = trend && trend.startsWith('+');

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Icon */}
        <div className={`${colors.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={28} className={colors.iconColor} />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 mt-3 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend}</span>
            <span className="text-gray-500 font-normal">vs last month</span>
          </div>
        )}

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
      </div>
    </div>
  );
}