import React from 'react'

const Icon = ({name}) => (
  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
    {name === 'home' ? '🏠' : '👁️'}
  </div>
)

export default function StatsCard({title, value, icon}){
  return (
    <div className="card flex items-center gap-4">
      <Icon name={icon} />
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  )
}