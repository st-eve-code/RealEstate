import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight, Search, DollarSign, Home, Filter, X, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { selectDocumentsByConstraint } from '@/lib/utils/firestoreDocumentOperation';

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

// Property Card Component
function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all images from the property
  const getAllImages = () => {
    const images = [];
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach(category => {
        if (category.urls && Array.isArray(category.urls)) {
          images.push(...category.urls);
        }
      });
    }
    // If no images, use placeholder
    if (images.length === 0) {
      return ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'];
    }
    return images;
  };

  const propertyImages = getAllImages();
  const scrollSpeed = 3000; // 3 seconds

  useEffect(() => {
    if (propertyImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
      }, scrollSpeed);
      
      return () => clearInterval(timer);
    }
  }, [propertyImages.length]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDotClick(index);
    }
  };

  // Format price
  const priceDisplay = property.payment
    ? `${parseFloat(property.payment.price || 0).toLocaleString()} ${property.payment.currency || 'XAF'}/${property.payment.period || 'monthly'}`
    : 'Price not set';

  // Calculate rating
  const rating = property.rating && property.rating.total > 0
    ? property.rating.value / property.rating.total
    : 0;

  // Get location string
  const locationString = property.location
    ? `${property.location.city || ''}, ${property.location.country || ''}`.replace(/^,\s*|,\s*$/g, '')
    : 'Location not set';

  return (
    <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={propertyImages[currentImageIndex]}
          alt={`${property.name || 'Property'} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
          }}
        />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[70%]">
          {property.status === 'approved' && (
            <span className="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Approved
            </span>
          )}
          {property.status === 'pending' && (
            <span className="bg-yellow-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
              Pending
            </span>
          )}
          {property.status === 'rejected' && (
            <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
              Rejected
            </span>
          )}
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className="p-0.5 hover:bg-gray-100 rounded-full transition"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        {propertyImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                  index === currentImageIndex 
                    ? 'bg-white w-6 h-2' 
                    : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                }`}
                aria-label={`View image ${index + 1} of ${propertyImages.length}`}
                aria-pressed={index === currentImageIndex}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight flex-1 min-w-0 line-clamp-1">
            {property.name || 'Untitled Property'}
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
          <span className="text-gray-600 text-xs sm:text-sm leading-snug line-clamp-1">{locationString}</span>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.rooms?.bedrooms || 0} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.rooms?.bathrooms || 0} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.rooms?.kitchens || 0} kitchen</span>
          </div>
        </div>

        <div className="flex items-center justify-between lg:gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
            <span className="text-base sm:text-base font-bold text-gray-800">
              {priceDisplay}
            </span>
          </div>
          <button 
            onClick={() => onViewDetails(property.id)}
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
function PropertyPage() {
  const { user } = useAuth();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    propertyType: '',
    sortBy: ''
  });

  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  // Fetch units for current caretaker
  useEffect(() => {
    const fetchCaretakerUnits = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const constraints = [
          {
            field: 'caretaker.id',
            operator: '==',
            value: user.uid
          }
        ];

        const result = await selectDocumentsByConstraint('units', constraints);
        
        if (result.success) {
          setUnits(result.data);
        } else {
          console.error('Error fetching units:', result.error);
        }
      } catch (error) {
        console.error('Error fetching caretaker units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaretakerUnits();
  }, [user]);

  // Extract unique locations and property types from units
  const locations = Array.from(new Set(units.map(u => u.location?.city).filter(Boolean)));
  const propertyTypes = [
    { value: 'apartment', label: 'Apartments' },
    { value: 'hostel', label: 'Hostels' },
    { value: 'studio', label: 'Studio' }
  ];
  const priceRanges = [
    { value: '0-100000', label: 'Under 100K' },
    { value: '100000-300000', label: '100K - 300K' },
    { value: '300000-500000', label: '300K - 500K' },
    { value: '500000-1000000', label: '500K - 1M' }
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

  const handleViewDetails = (propertyId) => {
    navigate(`/dashboard/properties/${propertyId}`);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const filterAndSortProperties = () => {
    let filtered = units.filter(unit => {
      if (filters.location && unit.location?.city !== filters.location) return false;

      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        const price = unit.payment?.price || 0;
        if (price < min || price > max) return false;
      }

      if (filters.propertyType && unit.type !== filters.propertyType) return false;

      return true;
    });

    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return (a.payment?.price || 0) - (b.payment?.price || 0);
          case 'price-high':
            return (b.payment?.price || 0) - (a.payment?.price || 0);
          case 'rating':
            const ratingA = a.rating && a.rating.total > 0 ? a.rating.value / a.rating.total : 0;
            const ratingB = b.rating && b.rating.total > 0 ? b.rating.value / b.rating.total : 0;
            return ratingB - ratingA;
          case 'popular':
            return (b.views || 0) - (a.views || 0);
          case 'recent':
            // Sort by createdAt if available
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toMillis() - a.createdAt.toMillis();
            }
            return 0;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredProperties = filterAndSortProperties();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2">
            My Properties
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and view all your listed properties</p>
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
            Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> of <span className="font-semibold">{units.length}</span> properties
          </p>
          {Object.values(favorites).filter(Boolean).length > 0 && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Heart className="w-4 h-4 inline fill-red-500 text-red-500" /> <span className="font-semibold text-gray-900">{Object.values(favorites).filter(Boolean).length}</span> favorites
            </p>
          )}
        </div>

        {/* Property Cards */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                isFavorite={favorites[property.id] || false}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {units.length === 0 
                ? "You haven't listed any properties yet. Start by listing your first property!"
                : "Try adjusting your filters to see more results."}
            </p>
            {units.length === 0 && (
              <a
                href="/dashboard/list-property"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors font-medium"
              >
                <Sparkles className="w-5 h-5" />
                List Your First Property
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;
