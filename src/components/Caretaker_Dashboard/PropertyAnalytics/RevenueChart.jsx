import React from 'react';

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const chartHeight = 250;

  return (
    <div className="w-full">
      <svg viewBox="0 0 600 300" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = 40 + (i * (chartHeight - 80) / 4);
          return (
            <g key={i}>
              <line 
                x1={60} 
                x2={580} 
                y1={y} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
              <text 
                x={50} 
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

        {/* Area path */}
        {data.length > 1 && (
          <>
            {/* Area fill */}
            <path
              d={`
                M ${60} ${chartHeight}
                ${data.map((item, index) => {
                  const x = 60 + (index * (520 / (data.length - 1)));
                  const y = 40 + ((maxRevenue - item.revenue) / maxRevenue) * (chartHeight - 80);
                  return `L ${x} ${y}`;
                }).join(' ')}
                L ${60 + (520)} ${chartHeight}
                Z
              `}
              fill="url(#areaGradient)"
            />
            
            {/* Line */}
            <path
              d={`
                M ${data.map((item, index) => {
                  const x = 60 + (index * (520 / (data.length - 1)));
                  const y = 40 + ((maxRevenue - item.revenue) / maxRevenue) * (chartHeight - 80);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
              `}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Data points */}
        {data.map((item, index) => {
          const x = 60 + (index * (520 / (data.length - 1)));
          const y = 40 + ((maxRevenue - item.revenue) / maxRevenue) * (chartHeight - 80);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-7 transition-all"
              />
              {/* Month label */}
              <text
                x={x}
                y={chartHeight + 25}
                fontSize="11"
                textAnchor="middle"
                fill="#6b7280"
                fontWeight="500"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
