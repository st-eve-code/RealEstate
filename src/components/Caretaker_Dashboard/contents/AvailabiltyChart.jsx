import React from 'react'

const data = [2, 1, 4, 3, 5, 2, 6] // sample counts

export default function AvailabilityChart(){
  const max = Math.max(...data)
  return (
    <div>
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1">
            <div className="bg-indigo-200 rounded-t-md" style={{height: `${(d/max)*100}%`}} />
            <div className="text-xs text-center text-gray-500 mt-2">Day {i+1}</div>
          </div>
        ))}
      </div>
    </div>
  )
}