import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Property data
const properties = [
  {
    id: 1,
    name: "Sunny Villa Apartments",
    location: "Molyko, Buea, Cameroon",
    price: "150,000 FCFA/month",
    scrollSpeed: 3000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 100,
    rating: 5
  },
  {
    id: 2,
    name: "Mountain View Residence",
    location: "Great Soppo, Buea, Cameroon",
    price: "200,000 FCFA/month",
    scrollSpeed: 4000,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 85,
    rating: 4.8
  },
  {
    id: 3,
    name: "Green Park Estate",
    location: "Bokwango, Buea, Cameroon",
    price: "180,000 FCFA/month",
    scrollSpeed: 2500,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 92,
    rating: 3.9
  }
];

// Individual property card component
function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Auto-scroll through images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, property.scrollSpeed);
    
    return () => clearInterval(timer);
  }, [property.images.length, property.scrollSpeed]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Image Section */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Hot and Free badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1.5 sm:gap-2">
          <span className="px-2 py-1 sm:px-4 sm:py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
            Hot
          </span>
          <span className="px-2 py-1 sm:px-4 sm:py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
            Free
          </span>
        </div>
        
        {/* Likes and rating badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-2 bg-white rounded-full px-2 py-1 sm:px-3 sm:py-1.5 shadow-md">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
          <span className="text-gray-700 font-medium text-xs sm:text-sm">{property.likes}</span>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-gray-700 font-medium text-xs sm:text-sm">{property.rating}</span>
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-blue-500 w-6 h-2.5' 
                  : 'bg-blue-300 hover:bg-red-400 w-2.5 h-2.5'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Property Details Section */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        
        {/* Property name with favorite button */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight flex-1 min-w-0">
            {property.name}
          </h2>
          <button 
            onClick={toggleFavorite}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{property.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 text-xs sm:text-sm font-medium whitespace-nowrap">{property.toilets} toilet</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 text-xs sm:text-sm font-medium whitespace-nowrap">{property.kitchens} kitchen</span>
          </div>
        </div>

        {/* Price and action button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            {property.price}
          </span>
          <button 
            className="flex-shrink-0 p-2.5 sm:p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg hover:shadow-xl"
            aria-label="View property details"
          >
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component
function Property() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
          Featured Properties
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Property;