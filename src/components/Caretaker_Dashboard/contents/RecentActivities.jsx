import React from 'react'

const activities = [
  { icon: '✉️', title: 'New unread emails' },
  { icon: '⚠️', title: 'Editing profile failed' },
  { icon: '⚠️', title: 'Failed changing status' },
  { icon: '⚠️', title: 'Failed changing status' }
]

export default function RecentActivities(){
  return (
    <div className="card w-80">
      <h4 className="font-semibold mb-3">Recent Activities</h4>
      <p className="text-sm text-gray-500 mb-4">Most recent activities carried out</p>

      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-xl">{a.icon}</div>
              <div className="text-sm">{a.title}</div>
            </div>
            <div className="text-gray-400">⋮</div>
          </div>
        ))}
      </div>
    </div>
  )
}