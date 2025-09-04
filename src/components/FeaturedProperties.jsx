// src/components/FeaturedProperties.jsx
import PropertyCard from './PropertyCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedProperties() {
  // Mock properties data
  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Downtown Penthouse",
      price: 3200,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1400,
      address: "456 Sky Tower",
      city: "Toronto",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop"
      ],
      features: ["parking", "petFriendly", "featured"],
      isNew: false,
      availableDate: "Available Dec 1"
    },
    {
      id: 2,
      title: "Modern Studio Apartment",
      price: 1250,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      address: "789 Urban Plaza",
      city: "Toronto",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"
      ],
      features: ["parking"],
      isNew: true,
      availableDate: "Available Now"
    },
    {
      id: 3,
      title: "Spacious Family House",
      price: 2800,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      address: "321 Maple Grove",
      city: "Toronto",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop"
      ],
      features: ["parking", "petFriendly"],
      isNew: false,
      availableDate: "Available Jan 15"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span className="text-yellow-600 font-semibold uppercase tracking-wide text-sm">
              Featured Properties
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Handpicked Properties
            <span className="block text-blue-600">Just For You</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our most popular and highest-rated rental properties. 
            These premium listings offer the best value and amenities.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            View All Properties
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Happy Tenants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">Fast</div>
              <div className="text-gray-600 font-medium">Application Process</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}