import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Bed, Bath, ArrowRight, Home } from 'lucide-react';

export default function PropertyPreview({ properties, loading }) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Featured Property</h4>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-44 rounded-xl mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const featuredProperty = properties?.[0];

  if (!featuredProperty) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Featured Property</h4>
        <div className="text-center py-8">
          <Home size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No properties yet</p>
          <button
            onClick={() => router.push('/dashboard/list-property')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            List Your First Property
          </button>
        </div>
      </div>
    );
  }

  const firstImage = featuredProperty.media?.[0]?.url || featuredProperty.images?.[0] || 'https://images.unsplash.com/photo-1560185127-6b341c0d34b6?w=600&q=80';
  const rating = featuredProperty.rating || 4.5;
  const totalUnits = featuredProperty.units?.length || 0;
  const minRent = featuredProperty.units?.reduce((min, unit) => 
    Math.min(min, unit.rent || Infinity), Infinity) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-shadow duration-300">
      <h4 className="font-semibold text-gray-900 mb-4">Featured Property</h4>

      {/* Property Image */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4">
        <img
          alt={featuredProperty.name || 'Property'}
          src={firstImage}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
          {totalUnits} units
        </div>
      </div>

      {/* Property Info */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {featuredProperty.name || 'Unnamed Property'}
        </h5>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={14} />
          <span className="line-clamp-1">
            {featuredProperty.location?.city || featuredProperty.address || 'Location not specified'}
          </span>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-orange-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-600">
            {featuredProperty.bedrooms || 0} beds • {featuredProperty.bathrooms || 0} baths
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Starting from</div>
            <div className="font-bold text-gray-900">
              {minRent > 0 ? `${minRent.toLocaleString()} XAF` : 'N/A'}
              <span className="text-xs font-normal text-gray-500">/month</span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/dashboard/properties/${featuredProperty.id}`)}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-200 group"
          >
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}