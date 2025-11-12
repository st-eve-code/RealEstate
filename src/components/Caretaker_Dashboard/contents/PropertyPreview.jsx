import React from 'react'

export default function PropertyPreview(){
  return (
    <div className="card w-80">
      <h4 className="font-semibold mb-3">My Property Preview</h4>

      <div className="rounded-xl overflow-hidden bg-gray-100">
        <img alt="apartment" src="https://images.unsplash.com/photo-1560185127-6b341c0d34b6?w=600&q=80" className="w-full h-44 object-cover" />
      </div>

      <div className="mt-3">
        <div className="font-semibold">Sunny Prince Apartment</div>
        <div className="text-xs text-gray-500">Mokolo Buea, Cameroon</div>

        <div className="flex items-center gap-3 mt-3">
          <div className="text-orange-400">⭐️ 5.0</div>
          <div className="text-sm text-gray-600">3 beds • 1 bathroom • 1 kitchen</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Starting from</div>
            <div className="font-semibold">150,000 FCFA/month</div>
          </div>
          <button className="px-3 py-2 rounded-lg bg-red-500 text-white">→</button>
        </div>
      </div>
    </div>
  )
}