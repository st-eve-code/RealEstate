import React from 'react';

export default function ViewsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  const maxViews = Math.max(...data.map(d => d.views), 1);
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, index) => {
          const height = (item.views / maxViews) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              {/* Bar */}
              <div className="w-full flex flex-col justify-end items-center" style={{ height: chartHeight }}>
                <div className="relative w-full">
                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.views} views
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  ></div>
                </div>
              </div>
              {/* Label */}
              <div className="mt-2 text-xs font-medium text-gray-600">{item.day}</div>
            </div>
          );
        })}
      </div>
      
      {/* Y-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <span>0</span>
        <span>{Math.round(maxViews / 2)}</span>
        <span>{maxViews}</span>
      </div>
    </div>
  );
}
