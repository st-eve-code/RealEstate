// src/components/PropertyCard.jsx
import { Heart, MapPin, Bed, Bath, Square, Car, PawPrint } from 'lucide-react';
import { useState } from 'react';

export default function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data if no property passed
  const mockProperty = {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 1850,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    address: "123 Main Street",
    city: "Toronto",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop"
    ],
    features: ["parking", "petFriendly"],
    isNew: true,
    availableDate: "Available Now"
  };

  const prop = property || mockProperty;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % prop.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + prop.images.length) % prop.images.length);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 cursor-pointer">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={prop.images[currentImageIndex]}
          alt={prop.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Image Navigation */}
        {prop.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            >
              ›
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {prop.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {prop.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              New
            </span>
          )}
          {prop.features.includes('featured') && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-200 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Price Overlay */}
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
          ${prop.price.toLocaleString()}/mo
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {prop.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{prop.address}, {prop.city}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-gray-400" />
              <span>{prop.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-gray-400" />
              <span>{prop.bathrooms} bath</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-gray-400" />
              <span>{prop.sqft} sqft</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-2 mb-4">
          {prop.features.includes('parking') && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
              <Car className="w-3 h-3 mr-1" />
              Parking
            </div>
          )}
          {prop.features.includes('petFriendly') && (
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-medium">
              <PawPrint className="w-3 h-3 mr-1" />
              Pet Friendly
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-600 font-semibold">
            {prop.availableDate}
          </span>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}