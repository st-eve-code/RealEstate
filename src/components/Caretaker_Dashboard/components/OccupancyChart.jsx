import React from 'react';

export default function OccupancyChart({ occupied = 0, vacant = 0, total = 0 }) {
  const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;
  const vacancyRate = total > 0 ? (vacant / total) * 100 : 0;

  // Donut chart parameters
  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offsets
  const occupiedOffset = circumference - (occupancyRate / 100) * circumference;
  const vacantOffset = circumference - (vacancyRate / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Donut Chart */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          
          {/* Occupied segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#occupiedGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={occupiedOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Vacant segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#vacantGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={vacantOffset + occupiedOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          <defs>
            <linearGradient id="occupiedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="vacantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">{Math.round(occupancyRate)}%</div>
          <div className="text-sm text-gray-500">Occupied</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-xs font-medium text-gray-600">Occupied</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{occupied}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
            <span className="text-xs font-medium text-gray-600">Vacant</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{vacant}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      </div>

      {/* Total units */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Total Units: </span>
        <span className="text-sm font-semibold text-gray-900">{total}</span>
      </div>
    </div>
  );
}
