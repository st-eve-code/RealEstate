import React from 'react';

const data = [
  { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 520000 },
  { month: 'Mar', revenue: 480000 },
  { month: 'Apr', revenue: 580000 },
  { month: 'May', revenue: 620000 },
  { month: 'Jun', revenue: 590000 },
  { month: 'Jul', revenue: 680000 },
];

export default function RevenueChart() {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;
  const barWidth = (chartWidth - padding * 2) / data.length;

  return (
    <div className="w-full">
      {/* Chart */}
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} 
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i * (chartHeight - padding * 2) / 4);
          return (
            <g key={i}>
              <line 
                x1={padding} 
                x2={chartWidth - padding} 
                y1={y} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
              <text 
                x={padding - 10} 
                y={y + 4} 
                fontSize="10" 
                textAnchor="end" 
                fill="#9ca3af"
              >
                {((maxRevenue * (4 - i) / 4) / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = ((item.revenue / maxRevenue) * (chartHeight - padding * 2));
          const x = padding + (index * barWidth) + barWidth * 0.2;
          const y = chartHeight - padding - barHeight;
          const width = barWidth * 0.6;

          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                fill="url(#barGradient)"
                rx="4"
                className="transition-all duration-300 hover:opacity-80"
              />
              
              {/* Month label */}
              <text
                x={x + width / 2}
                y={chartHeight - padding + 20}
                fontSize="11"
                textAnchor="middle"
                fill="#6b7280"
                fontWeight="500"
              >
                {item.month}
              </text>

              {/* Value on hover */}
              <text
                x={x + width / 2}
                y={y - 8}
                fontSize="10"
                textAnchor="middle"
                fill="#3b82f6"
                fontWeight="600"
                className="opacity-0 hover:opacity-100 transition-opacity"
              >
                {(item.revenue / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <span className="text-xs text-gray-600">Monthly Revenue (XAF)</span>
        </div>
      </div>
    </div>
  );
}
