import React from 'react';

const galleryImages = [
  {
    id: 1,
    title: 'Hostels',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    description: 'We provide the best hostel qualities for all your needs.',
  },
  {
    id: 2,
    title: 'Apartments',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
    description: 'Our apartments are designed to offer comfort, style, and convenience.',
  },
  {
    id: 3,
    title: 'Studios',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=600&fit=crop',
    description: 'Compact and modern studios with all the essentials for solo living.',
  },
  {
    id: 4,
    title: 'Houses',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    description: 'Discover homes designed to give you space, privacy, and lifestyle.',
  },
];

export default function List_products() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Image 1: wide and short */}
        <div className="relative h-40 sm:h-44 md:h-48 col-span-1 sm:col-span-2 overflow-hidden rounded-xl shadow-md group">
          <img
            src={galleryImages[0].image}
            alt={galleryImages[0].title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-lg font-semibold mb-1">{galleryImages[0].title}</h3>
            <p className="text-white text-sm">{galleryImages[0].description}</p>
          </div>
        </div>

        {/* Image 2: tall */}
        <div className="relative h-52 overflow-hidden rounded-xl shadow-md group">
          <img
            src={galleryImages[1].image}
            alt={galleryImages[1].title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-base font-semibold mb-1">{galleryImages[1].title}</h3>
            <p className="text-white text-sm">{galleryImages[1].description}</p>
          </div>
        </div>

        {/* Image 3: square */}
        <div className="relative h-52 overflow-hidden rounded-xl shadow-md group">
          <img
            src={galleryImages[2].image}
            alt={galleryImages[2].title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-base font-semibold mb-1">{galleryImages[2].title}</h3>
            <p className="text-white text-sm">{galleryImages[2].description}</p>
          </div>
        </div>

        {/* Image 4: wide and compact */}
        <div className="relative h-36 sm:col-span-2 overflow-hidden rounded-xl shadow-md group">
          <img
            src={galleryImages[3].image}
            alt={galleryImages[3].title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-base font-semibold mb-1">{galleryImages[3].title}</h3>
            <p className="text-white text-sm">{galleryImages[3].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
