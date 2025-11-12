import React from 'react'

export default function PieChart(){
  // simple fixed slices (angles in degrees)
  const slices = [
    { label: 'Apartments', value: 50, color: '#10B981' },
    { label: 'Studios', value: 30, color: '#3B82F6' },
    { label: 'Hostels', value: 10, color: '#F97316' },
    { label: 'Villa', value: 10, color: '#EF4444' }
  ]

  const radius = 40
  const center = 50
  let cumulative = 0

  function polarToCartesian(cx, cy, r, deg){
    const rad = (deg - 90) * Math.PI / 180.0
    return { x: cx + (r * Math.cos(rad)), y: cy + (r * Math.sin(rad)) }
  }

  function arcPath(cx, cy, r, startAngle, endAngle){
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
  }

  return (
    <div className="flex gap-4 items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        {slices.map((s, i) => {
          const start = cumulative
          const end = cumulative + s.value
          const d = arcPath(center, center, radius, (start/100)*360, (end/100)*360)
          cumulative += s.value
          return <path key={i} d={d} fill={s.color} stroke="#fff" strokeWidth="0.5" />
        })}
      </svg>

      <div>
        <h4 className="font-semibold">Property Type</h4>
        <ul className="mt-2 text-sm text-gray-600 space-y-2">
          {slices.map((s,i) => (
            <li key={i} className="flex items-center gap-2">
              <span style={{background: s.color}} className="w-3 h-3 rounded-full inline-block" />
              <span className="capitalize">{s.label}</span>
              <span className="ml-2 text-xs text-gray-400">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}