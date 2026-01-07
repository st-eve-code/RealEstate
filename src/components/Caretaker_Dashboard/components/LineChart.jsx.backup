import React from 'react'

const data = [30, 22, 18, 24, 28, 30, 33]
const labels = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

function buildPath(points, w, h, padding){
  // points normalized to chart area
  return points.map((p, i) => `${i===0?'M':'L'} ${ (padding + (i*(w-2*padding)/(points.length-1))).toFixed(2)} ${ (h - padding - p).toFixed(2) }`).join(' ')
}

export default function LineChart(){
  const w = 900, h = 260, padding = 24
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  // normalize data to pixel heights
  const points = data.map(v => ((v - min) / range) * (h - padding*2 - 10) + 10)

  const pathD = buildPath(points, w, h, padding)

  // area path for fill (closing to bottom)
  const areaPath = `${pathD} L ${w - padding} ${h - padding} L ${padding} ${h - padding} Z`

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#CFF0FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#CFF0FF" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {[0,1,2,3].map(i => {
          const y = padding + i * ( (h - padding*2) / 3 )
          return <line key={i} x1={padding} x2={w-padding} y1={y} y2={y} stroke="#f0f4f8" strokeWidth="1" />
        })}

        {/* area */}
        <path d={areaPath} fill="url(#g1)" stroke="none" />

        {/* line */}
        <path d={pathD} fill="none" stroke="#2bb0d8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
        {points.map((p, i) => {
          const x = padding + (i*(w-2*padding)/(points.length-1))
          const y = h - padding - p
          return <circle key={i} cx={x} cy={y} r="4" fill="#2bb0d8" stroke="#fff" strokeWidth="1.5" />
        })}

        {/* x labels */}
        {labels.map((lab, i) => {
          const x = padding + (i*(w-2*padding)/(labels.length-1))
          return <text key={i} x={x} y={h - 4} fontSize="10" textAnchor="middle" fill="#9aa4b2">{lab}</text>
        })}
      </svg>
    </div>
  )
}