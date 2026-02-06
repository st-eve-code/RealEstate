import React from 'react';

export default function OccupancyDonut({ occupied = 0, vacant = 0, rate = 0 }) {
  const total = occupied + vacant || 1;
  const occupiedPercentage = (occupied / total) * 100;
  const vacantPercentage = (vacant / total) * 100;

  // Donut chart parameters
  const size = 200;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke offsets
  const occupiedOffset = circumference - (occupiedPercentage / 100) * circumference;
  const vacantOffset = circumference - (vacantPercentage / 100) * circumference;

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
          
          {/* Occupied segment (green) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={occupiedOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Vacant segment (orange) - starts where occupied ends */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={vacantOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              strokeDashoffset: vacantOffset + occupiedOffset
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">{rate}%</div>
          <div className="text-sm text-gray-500">Occupied</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">Occupied</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{occupied}</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs font-medium text-gray-600">Vacant</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{vacant}</div>
        </div>
      </div>
    </div>
  );
}
