import React from 'react'

export default function PromoBanner(){
  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-lg bg-indigo-50 flex items-center justify-center">
          <img alt="promo" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div>
          <div className="text-2xl font-bold">Up to <span className="text-4xl text-accent">30% OFF</span></div>
          <p className="text-sm text-gray-500">Exclusive Discounts! June 15-20</p>
        </div>
      </div>

      <div>
        <button className="px-4 py-2 rounded-full bg-accent text-white">Explore</button>
      </div>
    </div>
  )
}