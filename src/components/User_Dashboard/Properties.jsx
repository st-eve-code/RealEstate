import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight, Search, DollarSign, Home, Filter, X, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

// Property data with dynamic badges
const properties = [
  {
    id: 1,
    name: "Sunny Villa Apartments",
    location: "Molyko",
    fullLocation: "Molyko, Buea, Cameroon",
    price: 150000,
    priceDisplay: "150,000 FCFA/month",
    type: "apartments",
    status: "available",
    popularity: "popular",
    badges: ["hot", "verified"],
    scrollSpeed: 3000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 100,
    rating: 5
  },
  {
    id: 2,
    name: "Mountain View Residence",
    location: "Great Soppo",
    fullLocation: "Great Soppo, Buea, Cameroon",
    price: 200000,
    priceDisplay: "200,000 FCFA/month",
    type: "hostels",
    status: "available",
    popularity: "recent",
    badges: ["new"],
    scrollSpeed: 4000,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 85,
    rating: 4.8
  },
  {
    id: 3,
    name: "Green Park Estate",
    location: "Bokwango",
    fullLocation: "Bokwango, Buea, Cameroon",
    price: 180000,
    priceDisplay: "180,000 FCFA/month",
    type: "studio",
    status: "available",
    popularity: "popular",
    badges: ["hot"],
    scrollSpeed: 2500,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 92,
    rating: 3.9
  },
  {
    id: 4,
    name: "Coastal Breeze Apartments",
    location: "Molyko",
    fullLocation: "Molyko, Buea, Cameroon",
    price: 350000,
    priceDisplay: "350,000 FCFA/month",
    type: "apartments",
    status: "available",
    popularity: "recent",
    badges: ["premium"],
    scrollSpeed: 3500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 3,
    bathrooms: 2,
    kitchens: 1,
    likes: 120,
    rating: 4.7
  },
  {
    id: 5,
    name: "Student Haven Hostel",
    location: "Great Soppo",
    fullLocation: "Great Soppo, Buea, Cameroon",
    price: 80000,
    priceDisplay: "80,000 FCFA/month",
    type: "hostels",
    status: "available",
    popularity: "popular",
    badges: ["budget"],
    scrollSpeed: 3200,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    bathrooms: 1,
    kitchens: 1,
    likes: 65,
    rating: 4.2
  },
  {
    id: 6,
    name: "Modern Studio Loft",
    location: "Bokwango",
    fullLocation: "Bokwango, Buea, Cameroon",
    price: 600000,
    priceDisplay: "600,000 FCFA/month",
    type: "studio",
    status: "available",
    popularity: "recent",
    badges: ["premium", "new"],
    scrollSpeed: 2800,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    bathrooms: 1,
    kitchens: 1,
    likes: 110,
    rating: 4.9
  }
];

// Star Rating Component
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
      ))}
      <span className="text-gray-700 font-medium text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// Badge Component
function PropertyBadge({ type }) {
  const badgeConfig = {
    hot: { bg: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'Hot', icon: TrendingUp },
    new: { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'New', icon: Sparkles },
    premium: { bg: 'bg-gradient-to-r from-purple-500 to-indigo-500', text: 'Premium', icon: Star },
    verified: { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'Verified', icon: Star },
    budget: { bg: 'bg-gradient-to-r from-teal-500 to-green-500', text: 'Budget', icon: DollarSign }
  };

  const config = badgeConfig[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`${config.bg} text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

// Individual property card component
function PropertyCard({ property, isFavorite, onToggleFavorite }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, property.scrollSpeed);
    
    return () => clearInterval(timer);
  }, [property.images.length, property.scrollSpeed]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const [currentPage, setCurrentPage] = useState('product');

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDotClick(index);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[currentImageIndex]} 
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[70%]">
          {property.badges.map((badge) => (
            <PropertyBadge key={badge} type={badge} />
          ))}
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500 text-red-500" />
          <span className="text-gray-700 font-semibold text-xs">{property.likes}</span>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentImageIndex 
                  ? 'bg-white w-6 h-2' 
                  : 'bg-white/60 hover:bg-white/80 w-2 h-2'
              }`}
              aria-label={`View image ${index + 1} of ${property.images.length}`}
              aria-pressed={index === currentImageIndex}
            />
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight flex-1 min-w-0 line-clamp-1">
            {property.name}
          </h3>
          <button 
            onClick={() => onToggleFavorite(property.id)}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600 text-xs sm:text-sm leading-snug line-clamp-1">{property.fullLocation}</span>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={property.rating} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.bathrooms} bathrooms</span>
          </div>
          <div className="flex items-center gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.kitchens} kitchen</span>
          </div>
        </div>

        <div className="flex items-center justify-between lg:gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
            <span className="text-base sm:text-base font-bold text-gray-800">
              {property.priceDisplay}
            </span>
          </div>
          <button onClick={()=>setCurrentPage('details')}
            className="flex-shrink-0 p-2 sm:p-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition shadow-md hover:shadow-lg group"
            aria-label={`View details for ${property.name}`}
          >
            <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component with filters
function Property() {
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    propertyType: '',
    sortBy: ''
  });

  const [favorites, setFavorites] = useState({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const locations = ['Molyko', 'Great Soppo', 'Bokwango'];
  const priceRanges = [
    { value: '0-100000', label: 'Under 100K' },
    { value: '100000-300000', label: '100K - 300K' },
    { value: '300000-500000', label: '300K - 500K' },
    { value: '500000-1000000', label: '500K - 1M' }
  ];
  const propertyTypes = [
    { value: 'apartments', label: 'Apartments' },
    { value: 'hostels', label: 'Hostels' },
    { value: 'studio', label: 'Studio' }
  ];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      price: '',
      propertyType: '',
      sortBy: ''
    });
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const filterAndSortProperties = () => {
    let filtered = properties.filter(property => {
      if (filters.location && property.location !== filters.location) return false;

      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        if (property.price < min || property.price > max) return false;
      }

      if (filters.propertyType && property.type !== filters.propertyType) return false;

      return true;
    });

    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popular':
            return a.popularity === 'popular' ? -1 : 1;
          case 'recent':
            return a.popularity === 'recent' ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredProperties = filterAndSortProperties();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-3 sm:p-6 lg:p-8">
      {currentPage === 'product' && (
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2">
              Featured Properties
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Discover your perfect home in Buea</p>
          </div>
          
          {/* Enhanced Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Search Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-green-600 transition-colors" />
                  <select
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Property Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-purple-600 transition-colors" />
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sort By</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-orange-600 transition-colors" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">Default</option>
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.location && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {filters.location}
                    <button onClick={() => handleFilterChange('location', '')} className="hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.price && (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    {priceRanges.find(r => r.value === filters.price)?.label}
                    <button onClick={() => handleFilterChange('price', '')} className="hover:text-green-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.propertyType && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <Home className="w-3.5 h-3.5" />
                    {propertyTypes.find(t => t.value === filters.propertyType)?.label}
                    <button onClick={() => handleFilterChange('propertyType', '')} className="hover:text-purple-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.sortBy && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {sortOptions.find(s => s.value === filters.sortBy)?.label}
                    <button onClick={() => handleFilterChange('sortBy', '')} className="hover:text-orange-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> of <span className="font-semibold">{properties.length}</span> properties
            </p>
            {Object.values(favorites).filter(Boolean).length > 0 && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Heart className="w-4 h-4 inline fill-red-500 text-red-500" /> <span className="font-semibold text-gray-900">{Object.values(favorites).filter(Boolean).length}</span> favorites
              </p>
            )}
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                isFavorite={favorites[property.id] || false}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
          
        </div>
      )}
      {currentPage === 'details' && (
        <div>
          details
        </div>
      )}
    </div>
  );
}

export default Property;